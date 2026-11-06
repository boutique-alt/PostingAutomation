import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/live-post
 * Deletes a post directly from Facebook Page Graph API or Instagram Graph API, or removes scheduled post from SQLite
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const platform = searchParams.get("platform");
    const clientId = searchParams.get("clientId") || "proj_hasibul";

    if (!postId) {
      return NextResponse.json({ error: "Missing postId" }, { status: 400 });
    }

    // 1. Delete from local SQLite queue/history
    try {
      db.prepare("DELETE FROM posts WHERE id = ?").run(postId);
    } catch (e) {}

    let client = null;
    try {
      client = db.prepare("SELECT * FROM clients WHERE id = ?").get(clientId) as any;
    } catch (e) {}

    const fbToken = client?.fbAccessToken || process.env.FB_PAGE_ACCESS_TOKEN;
    const igToken = client?.igAccessToken || fbToken;

    // 2. Direct Instagram Delete Attempt via Graph API
    if (platform === "instagram" || postId.startsWith("ig_")) {
      const cleanPostId = postId.replace("ig_", "");
      if (igToken) {
        try {
          const igRes = await fetch(`https://graph.facebook.com/v21.0/${cleanPostId}?access_token=${igToken}`, {
            method: "DELETE",
          });
          const igData = await igRes.json();
          console.log("Direct Instagram Delete API response:", igData);
          if (igData.success) {
            return NextResponse.json({ success: true, message: "Post deleted directly from Instagram and queue!" });
          } else if (igData.error) {
            return NextResponse.json({
              success: false,
              error: `Instagram API Error: ${igData.error.message}`,
              metaNotice: "Instagram requires posts to be deleted directly via the Instagram App if token lacks manage permissions.",
            }, { status: 400 });
          }
        } catch (e: any) {
          console.error("IG delete network error:", e);
        }
      }
      return NextResponse.json({
        success: true,
        message: "Removed from local app feed. (Instagram posts can also be deleted directly inside the Instagram app).",
        instagramNotice: true,
      });
    }

    // 3. Direct Facebook Page Delete via Graph API
    if (platform === "facebook" || postId.startsWith("fb_") || (postId.includes("_") && !postId.startsWith("ig_"))) {
      if (fbToken) {
        const cleanPostId = postId.replace("fb_", "");
        const fbRes = await fetch(`https://graph.facebook.com/v21.0/${cleanPostId}?access_token=${fbToken}`, {
          method: "DELETE",
        });
        const fbData = await fbRes.json();
        console.log("Direct Facebook Delete API response:", fbData);
        if (fbData.error) {
          return NextResponse.json({ success: false, error: fbData.error.message }, { status: 400 });
        }
        return NextResponse.json({ success: true, message: "Post deleted directly from Facebook Page!" });
      }
    }

    return NextResponse.json({ success: true, message: "Post removed from queue" });
  } catch (err: any) {
    console.error("Delete live post error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/live-post
 * Updates the caption of a live Facebook post via Graph API
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, newCaption, clientId, platform } = body;

    if (!postId) {
      return NextResponse.json({ error: "Missing postId" }, { status: 400 });
    }

    // 1. Update in local SQLite
    try {
      db.prepare("UPDATE posts SET caption = ? WHERE id = ?").run(newCaption, postId);
    } catch (e) {}

    // Instagram check: Meta strictly does NOT provide an API to edit published captions
    if (platform === "instagram" || postId.startsWith("ig_")) {
      return NextResponse.json({
        success: false,
        isInstagram: true,
        error: "Meta (Instagram) does not support editing captions via API after publication. You can edit it directly in the Instagram app, or click 'Repost now' with the new caption.",
      }, { status: 400 });
    }

    // 2. Direct Facebook Page Edit via Graph API
    if (postId.startsWith("fb_") || (postId.includes("_") && !postId.startsWith("ig_"))) {
      let client = null;
      try {
        client = db.prepare("SELECT * FROM clients WHERE id = ?").get(clientId || "proj_hasibul") as any;
      } catch (e) {}

      const fbToken = client?.fbAccessToken || process.env.FB_PAGE_ACCESS_TOKEN;
      if (fbToken) {
        const cleanPostId = postId.replace("fb_", "");
        const fbRes = await fetch(`https://graph.facebook.com/v21.0/${cleanPostId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: newCaption, access_token: fbToken }),
        });
        const fbData = await fbRes.json();
        console.log("Direct Facebook Edit API response:", fbData);
        if (fbData.error) {
          return NextResponse.json({ success: false, error: fbData.error.message }, { status: 400 });
        }
        return NextResponse.json({ success: true, message: "Facebook post caption updated directly on Facebook Page!" });
      }
    }

    return NextResponse.json({ success: true, message: "Caption updated in queue" });
  } catch (err: any) {
    console.error("Edit live post error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
