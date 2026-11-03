import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { fbPageId, fbToken, videoId, caption, scheduleEpoch } = await req.json();

    if (!fbPageId || !fbToken || !videoId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Step 3: Finish & Publish the Reel on Facebook
    const finishPayload: any = {
      upload_phase: "finish",
      video_id: videoId,
      video_state: scheduleEpoch ? "SCHEDULED" : "PUBLISHED",
      description: caption || "",
      title: caption ? caption.slice(0, 50) : "New Reel",
      access_token: fbToken,
    };

    if (scheduleEpoch) {
      finishPayload.scheduled_publish_time = scheduleEpoch;
    }

    const finishRes = await fetch(`https://graph.facebook.com/v21.0/${fbPageId}/video_reels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finishPayload),
    });

    const finishData = await finishRes.json();
    if (finishData.error) {
      return NextResponse.json({ error: finishData.error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      videoId: finishData.id || videoId,
      data: finishData,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
