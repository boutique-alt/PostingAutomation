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
        id, clientId, projectName, platforms, postType, caption, status, errorMessage, time, mediaCount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      data.mediaCount || 0
    );

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
