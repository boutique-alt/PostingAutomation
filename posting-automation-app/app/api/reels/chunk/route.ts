import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const uploadUrl = req.headers.get("x-upload-url");
    const fbToken = req.headers.get("x-fb-token");
    const offset = req.headers.get("x-offset") || "0";
    const totalSize = req.headers.get("x-file-size");

    if (!uploadUrl || !fbToken) {
      return NextResponse.json({ error: "Missing uploadUrl or token headers" }, { status: 400 });
    }

    const chunkArrayBuffer = await req.arrayBuffer();

    // Server-to-server forward directly to rupload.facebook.com (No CORS issues!)
    const fbChunkRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `OAuth ${fbToken}`,
        offset: offset,
        file_size: totalSize || String(chunkArrayBuffer.byteLength),
        "Content-Type": "application/octet-stream",
      },
      body: Buffer.from(chunkArrayBuffer),
    });

    const resText = await fbChunkRes.text();
    if (!fbChunkRes.ok) {
      return NextResponse.json({ error: resText }, { status: fbChunkRes.status });
    }

    let parsed = {};
    try {
      parsed = JSON.parse(resText);
    } catch {
      parsed = { raw: resText };
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
