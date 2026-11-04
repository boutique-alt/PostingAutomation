import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for video upload processing

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
    let clientScheduleEpoch: number | null = null;
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
      const rawEpoch = formData.get("scheduleEpoch") as string;
      if (rawEpoch) clientScheduleEpoch = parseInt(rawEpoch, 10);
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

        if (isScheduled) {
          const currentEpoch = Math.floor(Date.now() / 1000);
          const targetEpoch = clientScheduleEpoch || (scheduleTime ? Math.floor(new Date(scheduleTime).getTime() / 1000) : null);
          
          if (targetEpoch) {
            // Facebook strictly requires scheduled_publish_time to be between 10 minutes (600s) and 75 days in future
            if (targetEpoch >= currentEpoch + 600) {
              scheduleEpoch = targetEpoch;
            } else {
              // If user selected less than 10 minutes, Meta API will reject with error #100.
              // So we automatically set it to 10.5 minutes from current time
              console.log("Selected time is within 10 minutes. Adjusting to 10.5 minutes for Facebook acceptance.");
              scheduleEpoch = currentEpoch + 630;
            }
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

        } else if (uploadFiles.length > 0 && (postType === "poster" || postType === "carousel")) {
          if (uploadFiles.length === 1 || postType === "poster") {
            // ==========================================
            // SINGLE DIRECT IMAGE UPLOAD TO FACEBOOK
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
            // MULTI-PHOTO CAROUSEL / ALBUM POST TO FACEBOOK
            // Step 1: Upload each photo with published=false to obtain photo IDs
            // Step 2: Publish single feed post attaching all attached_media
            // ==========================================
            console.log(`Publishing Carousel with ${uploadFiles.length} photos...`);
            const photoIds: string[] = [];

            for (const file of uploadFiles) {
              const photoForm = new FormData();
              photoForm.append("source", file);
              photoForm.append("published", "false");
              photoForm.append("access_token", fbToken);

              const photoRes = await fetch(
                `https://graph.facebook.com/v19.0/${fbPageId}/photos`,
                {
                  method: "POST",
                  body: photoForm,
                }
              );
              const pData = await photoRes.json();
              if (pData.error) {
                console.error("Error uploading carousel item:", pData.error);
                throw new Error(pData.error.message || "Failed to upload photo for carousel");
              }
              if (pData.id) {
                photoIds.push(pData.id);
              }
            }

            // Step 2: Create Feed post containing all attached media
            const feedPayload: any = {
              message: caption || "",
              access_token: fbToken,
              attached_media: photoIds.map((id) => ({ media_fbid: id })),
            };

            if (scheduleEpoch) {
              feedPayload.published = false;
              feedPayload.scheduled_publish_time = scheduleEpoch;
            }

            const multiRes = await fetch(
              `https://graph.facebook.com/v19.0/${fbPageId}/feed`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feedPayload),
              }
            );
            const multiData = await multiRes.json();
            if (multiData.error) {
              console.error("Multi-photo Feed Error:", multiData.error);
              throw new Error(multiData.error.message || "Facebook Carousel Feed Publish Failed");
            }
            fbPostId = multiData.id;
            console.log("Facebook Multi-Photo Carousel Published successfully. ID:", fbPostId);
          }

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

    // -------------------------------------------------------------
    // 2. REAL INSTAGRAM BUSINESS / CREATOR POSTING (Photos & Reels)
    // -------------------------------------------------------------
    const igAccountId = clientCredentials?.igAccountId || process.env.IG_ACCOUNT_ID;
    const igToken = clientCredentials?.igToken || clientCredentials?.fbToken || process.env.FB_PAGE_ACCESS_TOKEN;

    if (platforms.includes("instagram") && igAccountId && igToken) {
      try {
        console.log("Publishing to Instagram Business:", igAccountId);

        if (uploadFiles.length === 0) {
          throw new Error("Instagram requires a photo or video to publish (text-only posts are not supported by Instagram).");
        }

        const mediaFile = uploadFiles[0];
        const isVideo = postType === "reel" || mediaFile.type.startsWith("video/");
        let directMediaUrl = "";

        // Instagram Graph API requires media to be available via a public URL.
        // For images: We use Meta's own high-speed CDN by uploading an unpublished photo to the linked Facebook Page!
        // This is 100% reliable, fast, never expires, and always accepted by Instagram Graph API without 3rd-party CDN failures.
        if (!isVideo && fbPageId && fbToken) {
          try {
            console.log("Hosting image via Meta Facebook CDN for Instagram...");
            const fbHostForm = new FormData();
            fbHostForm.append("source", mediaFile);
            fbHostForm.append("published", "false");
            fbHostForm.append("access_token", fbToken);

            const fbHostRes = await fetch(`https://graph.facebook.com/v21.0/${fbPageId}/photos`, {
              method: "POST",
              body: fbHostForm,
            });
            const fbHostData = await fbHostRes.json();
            if (fbHostData.id) {
              const photoDetailsRes = await fetch(
                `https://graph.facebook.com/v21.0/${fbHostData.id}?fields=images&access_token=${fbToken}`
              );
              const details = await photoDetailsRes.json();
              if (details.images && details.images.length > 0) {
                directMediaUrl = details.images[0].source;
                console.log("Obtained Meta CDN Image URL for Instagram:", directMediaUrl);
              }
            }
          } catch (metaCdnErr) {
            console.warn("Failed to get Meta CDN link, trying fallback...", metaCdnErr);
          }
        }

        // Fallback or Video upload to tmpfiles / public CDN
        if (!directMediaUrl) {
          const uploadForm = new FormData();
          uploadForm.append("file", mediaFile, mediaFile.name);

          const cdnRes = await fetch("https://tmpfiles.org/api/v1/upload", {
            method: "POST",
            body: uploadForm,
          });
          const cdnData = await cdnRes.json();
          if (!cdnData.data?.url) {
            throw new Error("Failed to host media temporarily for Instagram Graph API.");
          }
          directMediaUrl = cdnData.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
          console.log("Direct Media URL for Instagram (tmpfiles):", directMediaUrl);
        }

        // Step 1: Create Instagram Media Container
        const containerPayload: any = {
          caption: caption || "",
          access_token: igToken,
        };

        if (isVideo) {
          containerPayload.media_type = "REELS";
          containerPayload.video_url = directMediaUrl;
        } else {
          containerPayload.image_url = directMediaUrl;
        }

        const containerRes = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/media`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(containerPayload),
        });
        const containerData = await containerRes.json();
        if (containerData.error) {
          console.error("Instagram Container Creation Error:", containerData.error);
          throw new Error(containerData.error.message || "Failed to create Instagram media container");
        }

        const creationId = containerData.id;
        console.log("Instagram Container Created. ID:", creationId);

        // Wait a few seconds for video encoding if it's a reel
        if (isVideo) {
          console.log("Waiting for Instagram video processing...");
          let ready = false;
          let attempts = 0;
          while (!ready && attempts < 10) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            attempts++;
            const statusRes = await fetch(`https://graph.facebook.com/v21.0/${creationId}?fields=status_code&access_token=${igToken}`);
            const statusData = await statusRes.json();
            if (statusData.status_code === "FINISHED") {
              ready = true;
            } else if (statusData.status_code === "ERROR") {
              throw new Error("Instagram video processing failed.");
            }
          }
        }

        // Step 2: Publish the Instagram Container
        const publishRes = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/media_publish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creation_id: creationId,
            access_token: igToken,
          }),
        });
        const pubData = await publishRes.json();
        if (pubData.error) {
          console.error("Instagram Publish Error:", pubData.error);
          throw new Error(pubData.error.message || "Failed to publish media on Instagram");
        }

        console.log("Instagram Published Successfully! ID:", pubData.id);
        results.instagram = {
          status: "published",
          postId: pubData.id,
          message: "Published successfully to Instagram!",
        };
      } catch (err: any) {
        console.error("Instagram API Error:", err.message);
        errors.instagram = err.message;
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
