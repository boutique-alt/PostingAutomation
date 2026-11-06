import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ success: true, clients: [] });
    }
    const rows = db.prepare("SELECT * FROM clients ORDER BY createdAt DESC").all() as any[];
    const clients = rows.map((row) => ({
      id: row.id,
      name: row.name,
      connectMode: row.connectMode,
      facebook: row.fbPageName
        ? {
            pageName: row.fbPageName,
            pageId: row.fbPageId,
            accessToken: row.fbAccessToken,
            connected: Boolean(row.fbConnected),
          }
        : undefined,
      instagram: row.igUsername
        ? {
            username: row.igUsername,
            accountId: row.igAccountId,
            accessToken: row.igAccessToken,
            connected: Boolean(row.igConnected),
          }
        : undefined,
      gbp: row.gbpLocationName || row.gbpLocationId
        ? {
            locationName: row.gbpLocationName,
            accountId: row.gbpAccountId,
            locationId: row.gbpLocationId,
            accessToken: row.gbpAccessToken,
            connected: Boolean(row.gbpConnected),
          }
        : undefined,
    }));

    return NextResponse.json({ success: true, clients });
  } catch (err: any) {
    return NextResponse.json({ success: true, clients: [], error: err.message });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const id = data.id || "proj_" + Date.now();

    if (!db) {
      return NextResponse.json({ success: true, id, fallback: true });
    }

    const insert = db.prepare(`
      INSERT OR REPLACE INTO clients (
        id, name, connectMode,
        fbPageName, fbPageId, fbAccessToken, fbConnected,
        igUsername, igAccountId, igAccessToken, igConnected,
        gbpLocationName, gbpAccountId, gbpLocationId, gbpAccessToken, gbpConnected
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      data.name,
      data.connectMode || "both",
      data.facebook?.pageName || null,
      data.facebook?.pageId || null,
      data.facebook?.accessToken || null,
      data.facebook?.connected ? 1 : 0,
      data.instagram?.username || null,
      data.instagram?.accountId || null,
      data.instagram?.accessToken || null,
      data.instagram?.connected ? 1 : 0,
      data.gbp?.locationName || null,
      data.gbp?.accountId || null,
      data.gbp?.locationId || null,
      data.gbp?.accessToken || null,
      data.gbp?.connected ? 1 : 0
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

    db.prepare("DELETE FROM clients WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
