import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { fbPageId, fbToken } = await req.json();

    if (!fbPageId || !fbToken) {
      return NextResponse.json({ error: "Missing pageId or token" }, { status: 400 });
    }

    // Step 1: Initialize Meta Reels Upload Session
    const initRes = await fetch(`https://graph.facebook.com/v21.0/${fbPageId}/video_reels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        upload_phase: "start",
        access_token: fbToken,
      }),
    });

    const initData = await initRes.json();
    if (initData.error) {
      return NextResponse.json({ error: initData.error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      videoId: initData.video_id,
      uploadUrl: initData.upload_url,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
