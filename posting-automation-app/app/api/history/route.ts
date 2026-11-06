import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = db.prepare("SELECT * FROM posts ORDER BY createdAt DESC").all() as any[];
    const history = rows.map((r) => ({
      id: r.id,
      clientId: r.clientId,
      projectName: r.projectName,
      platforms: JSON.parse(r.platforms || "[]"),
      postType: r.postType,
      caption: r.caption || "",
      status: r.status,
      errorMessage: r.errorMessage,
      time: r.time,
      mediaCount: r.mediaCount,
      mediaPath: r.mediaPath || null,
      scheduleEpoch: r.scheduleEpoch || null,
    }));

    return NextResponse.json({ success: true, history });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const id = data.id || "post_" + Date.now();

    const insert = db.prepare(`
      INSERT OR REPLACE INTO posts (
        id, clientId, projectName, platforms, postType, caption, status, errorMessage, time, mediaCount, mediaPath, scheduleEpoch
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      data.clientId || null,
      data.projectName,
      JSON.stringify(data.platforms || []),
      data.postType,
      data.caption || "",
      data.status,
      data.errorMessage || null,
      data.time || "Just now",
      data.mediaCount || 0,
      data.mediaPath || null,
      data.scheduleEpoch || null
    );

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    db.prepare("DELETE FROM posts WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
