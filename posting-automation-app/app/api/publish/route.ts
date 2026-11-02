import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let projectId = "";
    let projectName = "";
    let platforms: string[] = [];
    let postType = "poster";
    let caption = "";
    let firstComment: string | null = null;
    let isScheduled = false;
    let scheduleTime: string | null = null;
    let clientCredentials: any = {};
    let uploadFiles: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      projectId = formData.get("projectId") as string;
      projectName = formData.get("projectName") as string;
      platforms = JSON.parse((formData.get("platforms") as string) || "[]");
      postType = (formData.get("postType") as string) || "poster";
      caption = (formData.get("caption") as string) || "";
      firstComment = (formData.get("firstComment") as string) || null;
      isScheduled = formData.get("isScheduled") === "true";
      scheduleTime = (formData.get("scheduleTime") as string) || null;
      clientCredentials = JSON.parse((formData.get("clientCredentials") as string) || "{}");

      const files = formData.getAll("files") as File[];
      if (files && files.length > 0) {
        uploadFiles = files.filter((f) => typeof f !== "string" && f.size > 0);
      }
    } else {
      const body = await req.json();
      projectId = body.projectId;
      projectName = body.projectName;
      platforms = body.platforms || [];
      postType = body.postType || "poster";
      caption = body.caption || "";
      firstComment = body.firstComment || null;
      isScheduled = body.isScheduled;
      scheduleTime = body.scheduleTime;
      clientCredentials = body.clientCredentials || {};
    }

    console.log("Publishing real post:", {
      projectName,
      platforms,
      postType,
      fileCount: uploadFiles.length,
      fileType: uploadFiles[0]?.type,
      fileSize: uploadFiles[0]?.size,
      hasComment: !!firstComment,
    });

    const results: Record<string, any> = {};
    const errors: Record<string, string> = {};

    const fbPageId = clientCredentials?.fbPageId || process.env.FB_PAGE_ID;
    const fbToken = clientCredentials?.fbToken || process.env.FB_PAGE_ACCESS_TOKEN;

    // -------------------------------------------------------------
    // 1. REAL FACEBOOK PAGE POSTING (Supports Text, Photo & Real Videos/Reels)
    // -------------------------------------------------------------
    if (platforms.includes("facebook") && fbPageId && fbToken) {
      try {
        let fbPostId = "";
        let scheduleEpoch: number | null = null;

        if (isScheduled && scheduleTime) {
          const parsed = Math.floor(new Date(scheduleTime).getTime() / 1000);
          const currentEpoch = Math.floor(Date.now() / 1000);
          // Facebook requires scheduled time to be between 10 minutes and 75 days in the future
          if (parsed > currentEpoch + 600) {
            scheduleEpoch = parsed;
          } else {
            console.warn("Scheduled time is less than 10 minutes in future. Scheduling for 11 mins from now.");
            scheduleEpoch = currentEpoch + 660;
          }
        }

        if (uploadFiles.length > 0 && postType === "reel") {
          // ==========================================
          // DIRECT VIDEO / REEL UPLOAD TO FACEBOOK
          // Endpoint: https://graph.facebook.com/v19.0/{page-id}/videos
          // ==========================================
          const videoFile = uploadFiles[0];
          console.log("Uploading Video/Reel to Facebook Page:", videoFile.name, videoFile.size);

          const fbVideoFormData = new FormData();
          fbVideoFormData.append("source", videoFile);
          fbVideoFormData.append("description", caption || "");
          fbVideoFormData.append("title", caption?.slice(0, 50) || "New Reel");
          fbVideoFormData.append("access_token", fbToken);

          if (scheduleEpoch) {
            fbVideoFormData.append("published", "false");
            fbVideoFormData.append("scheduled_publish_time", String(scheduleEpoch));
          }

          const fbVideoRes = await fetch(
            `https://graph.facebook.com/v19.0/${fbPageId}/videos`,
            {
              method: "POST",
              body: fbVideoFormData,
            }
          );

          const videoData = await fbVideoRes.json();
          if (videoData.error) {
            console.error("Facebook Video API Error:", videoData.error);
            throw new Error(videoData.error.message || "Facebook Video Publish Failed");
          }

          fbPostId = videoData.id;
          console.log("Facebook Video/Reel Uploaded successfully. ID:", fbPostId);

        } else if (uploadFiles.length > 0 && postType === "poster") {
          // ==========================================
          // DIRECT IMAGE UPLOAD TO FACEBOOK
          // Endpoint: https://graph.facebook.com/v19.0/{page-id}/photos
          // ==========================================
          const fbPhotoFormData = new FormData();
          fbPhotoFormData.append("source", uploadFiles[0]);
          fbPhotoFormData.append("caption", caption || "");
          fbPhotoFormData.append("access_token", fbToken);

          if (scheduleEpoch) {
            fbPhotoFormData.append("published", "false");
            fbPhotoFormData.append("scheduled_publish_time", String(scheduleEpoch));
          }

          const fbPhotoRes = await fetch(
            `https://graph.facebook.com/v19.0/${fbPageId}/photos`,
            {
              method: "POST",
              body: fbPhotoFormData,
            }
          );
          const photoData = await fbPhotoRes.json();
          if (photoData.error) {
            throw new Error(photoData.error.message || "Facebook Photo Publish Failed");
          }
          fbPostId = photoData.post_id || photoData.id;

        } else {
          // ==========================================
          // REGULAR TEXT / FEED POST
          // Endpoint: https://graph.facebook.com/v19.0/{page-id}/feed
          // ==========================================
          const feedPayload: any = {
            message: caption || "",
            access_token: fbToken,
          };

          if (scheduleEpoch) {
            feedPayload.published = false;
            feedPayload.scheduled_publish_time = scheduleEpoch;
          }

          const fbFeedRes = await fetch(
            `https://graph.facebook.com/v19.0/${fbPageId}/feed`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(feedPayload),
            }
          );
          const feedData = await fbFeedRes.json();
          if (feedData.error) {
            throw new Error(feedData.error.message || "Facebook Feed Publish Failed");
          }
          fbPostId = feedData.id;
        }

        // ==========================================
        // AUTO FIRST COMMENT ON THE CREATED POST
        // ==========================================
        if (firstComment && fbPostId) {
          try {
            await fetch(`https://graph.facebook.com/v19.0/${fbPostId}/comments`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: firstComment,
                access_token: fbToken,
              }),
            });
          } catch (e) {
            console.error("First Comment Error:", e);
          }
        }

        results.facebook = {
          status: "published",
          postId: fbPostId,
          message: postType === "reel" ? "Video/Reel uploaded successfully!" : "Post published successfully!",
        };
      } catch (err: any) {
        console.error("Facebook API Error:", err.message);
        errors.facebook = err.message;
      }
    }

    const hasErrors = Object.keys(errors).length > 0;

    return NextResponse.json({
      success: !hasErrors,
      status: isScheduled ? "scheduled" : hasErrors ? "failed" : "published",
      results,
      errors: hasErrors ? errors : undefined,
      message: hasErrors
        ? `Error publishing: ${Object.values(errors).join(", ")}`
        : isScheduled
        ? `Scheduled for ${scheduleTime}`
        : "Post published successfully!",
    });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process post" },
      { status: 500 }
    );
  }
}
