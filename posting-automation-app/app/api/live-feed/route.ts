import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/live-feed
 * Fetches REAL, LIVE published posts directly from Facebook Graph API & Instagram Graph API
 * with exact real image/video URLs, real captions, real likes count, real comments count & permalinks!
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId") || "proj_hasibul";

    // 1. Get client credentials from SQLite
    let client = null;
    try {
      client = db.prepare("SELECT * FROM clients WHERE id = ?").get(clientId) as any;
    } catch (e) {}

    const fbPageId = client?.fbPageId || process.env.FB_PAGE_ID || "1415107628351660";
    const fbToken = client?.fbAccessToken || process.env.FB_PAGE_ACCESS_TOKEN;
    const igAccountId = client?.igAccountId || "17841439096613191";
    const igToken = client?.igAccessToken || fbToken;

    const liveItems: any[] = [];

    // 2. Fetch REAL Instagram Posts from Meta Graph API
    if (igAccountId && igToken) {
      try {
        const igUrl = `https://graph.facebook.com/v21.0/${igAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=15&access_token=${igToken}`;
        const igRes = await fetch(igUrl, { cache: "no-store" });
        const igData = await igRes.json();

        if (igData.data && Array.isArray(igData.data)) {
          for (const item of igData.data) {
            const isVideo = item.media_type === "VIDEO";
            const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent";

            liveItems.push({
              id: "ig_" + item.id,
              originalId: item.id,
              platform: "instagram",
              projectName: client?.name || "Hasibul",
              postType: isVideo ? "reel" : "poster",
              caption: item.caption || "",
              mediaUrl: item.media_url || item.thumbnail_url || null,
              isVideo,
              permalink: item.permalink,
              time: dateStr,
              timestamp: item.timestamp ? new Date(item.timestamp).getTime() : 0,
              likes: item.like_count ?? 0,
              comments: item.comments_count ?? 0,
              views: null, // No dummy estimate
              status: "published",
            });
          }
        }
      } catch (igErr) {
        console.error("Live Instagram fetch error:", igErr);
      }
    }

    // 3. Fetch REAL Facebook Page Posts from Meta Graph API
    if (fbPageId && fbToken) {
      try {
        const fbUrl = `https://graph.facebook.com/v21.0/${fbPageId}/published_posts?fields=id,message,created_time,permalink_url,full_picture,shares,reactions.summary(total_count),comments.summary(total_count)&limit=15&access_token=${fbToken}`;
        const fbRes = await fetch(fbUrl, { cache: "no-store" });
        const fbData = await fbRes.json();

        if (fbData.data && Array.isArray(fbData.data)) {
          for (const item of fbData.data) {
            const dateStr = item.created_time ? new Date(item.created_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent";
            const likesCount = item.reactions?.summary?.total_count ?? 0;
            const commentsCount = item.comments?.summary?.total_count ?? 0;
            const sharesCount = item.shares?.count ?? 0;

            liveItems.push({
              id: "fb_" + item.id,
              originalId: item.id,
              platform: "facebook",
              projectName: client?.name || "Hasibul",
              postType: item.full_picture ? "poster" : "text",
              caption: item.message || "",
              mediaUrl: item.full_picture || null,
              isVideo: false,
              permalink: item.permalink_url,
              time: dateStr,
              timestamp: item.created_time ? new Date(item.created_time).getTime() : 0,
              likes: likesCount,
              comments: commentsCount,
              shares: sharesCount,
              views: null, // No dummy estimate
              status: "published",
            });
          }
        }
      } catch (fbErr) {
        console.error("Live Facebook fetch error:", fbErr);
      }

      // 3.1 Fetch REAL Scheduled Posts directly from Facebook Page Graph API (includes real full_picture image preview!)
      try {
        const fbSchedUrl = `https://graph.facebook.com/v21.0/${fbPageId}/scheduled_posts?fields=id,message,created_time,scheduled_publish_time,permalink_url,full_picture&limit=15&access_token=${fbToken}`;
        const fbSchedRes = await fetch(fbSchedUrl, { cache: "no-store" });
        const fbSchedData = await fbSchedRes.json();
        console.log("Facebook Live Scheduled Posts fetched from Meta:", fbSchedData?.data?.length || 0);

        if (fbSchedData.data && Array.isArray(fbSchedData.data)) {
          for (const item of fbSchedData.data) {
            const schedEpoch = item.scheduled_publish_time ? item.scheduled_publish_time * 1000 : Date.now();
            const schedDateStr = `Scheduled for ${new Date(schedEpoch).toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${new Date(schedEpoch).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

            liveItems.push({
              id: "fb_sched_" + item.id,
              originalId: item.id,
              platform: "facebook",
              projectName: client?.name || "Hasibul",
              postType: item.full_picture ? "poster" : "text",
              caption: item.message || "",
              mediaUrl: item.full_picture || null,
              isVideo: false,
              permalink: item.permalink_url,
              time: schedDateStr,
              timestamp: schedEpoch,
              likes: 0,
              comments: 0,
              shares: 0,
              views: 0,
              status: "scheduled",
            });
          }
        }
      } catch (fbSchedErr) {
        console.error("Live Facebook Scheduled Posts fetch error:", fbSchedErr);
      }
    }

    // 4. Also fetch Scheduled Queue from local SQLite DB so scheduled posts show alongside live ones!
    try {
      const scheduledRows = db.prepare("SELECT * FROM posts WHERE status = 'scheduled' ORDER BY createdAt DESC").all() as any[];
      for (const s of scheduledRows) {
        // Only add if not already present from live Facebook scheduled_posts
        const alreadyInFeed = liveItems.some(
          (item) => item.status === "scheduled" && (item.caption === s.caption || item.originalId === s.id)
        );

        if (!alreadyInFeed) {
          liveItems.unshift({
            id: s.id,
            originalId: s.id,
            platform: (JSON.parse(s.platforms || "[]")[0] || "facebook"),
            projectName: s.projectName,
            postType: s.postType,
            caption: s.caption,
            mediaUrl: s.mediaPath || null,
            isVideo: s.postType === "reel",
            permalink: null,
            time: s.time,
            timestamp: s.scheduleEpoch ? s.scheduleEpoch * 1000 : Date.now(),
            likes: 0,
            comments: 0,
            views: 0,
            status: "scheduled",
          });
        }
      }
    } catch (e) {}

    // Sort all: Scheduled first, then latest published posts
    liveItems.sort((a, b) => {
      if (a.status === "scheduled" && b.status !== "scheduled") return -1;
      if (b.status === "scheduled" && a.status !== "scheduled") return 1;
      return b.timestamp - a.timestamp;
    });

    return NextResponse.json({
      success: true,
      count: liveItems.length,
      posts: liveItems,
    });
  } catch (err: any) {
    console.error("Fetch live feed error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
