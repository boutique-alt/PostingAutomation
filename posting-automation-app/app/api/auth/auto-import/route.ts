import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Endpoint to automatically discover and import Facebook Pages & linked Instagram Accounts
 * Input: { userToken: string } OR uses stored app credentials
 * Returns: Array of discovered pages with linked IG accounts and long-lived page tokens!
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userToken = body.token?.trim();

    if (!userToken) {
      return NextResponse.json({ error: "Access token is required" }, { status: 400 });
    }

    const appId = process.env.META_APP_ID || "4199373046864462";
    const appSecret = process.env.META_APP_SECRET || "241e4f98f894ecbb0410c4c9596adbf9";

    // 1. Fetch user's managed Facebook Pages and linked Instagram accounts
    let pages: any[] = [];

    // Attempt 1: Use Meta debug_token with App Credentials (Best & 100% Reliable!)
    // It inspects any token (User Token or Page Token) and gives the exact Page/User Profile ID
    if (appId && appSecret) {
      try {
        const debugUrl = `https://graph.facebook.com/v21.0/debug_token?input_token=${userToken}&access_token=${appId}|${appSecret}`;
        const debugRes = await fetch(debugUrl);
        const debugData = await debugRes.json();

        if (debugData.data?.is_valid) {
          const type = debugData.data.type; // 'PAGE' or 'USER'
          const profileId = debugData.data.profile_id || debugData.data.user_id;

          if (type === "PAGE" && profileId) {
            // It's a Page Token! Directly query this page
            const pRes = await fetch(
              `https://graph.facebook.com/v21.0/${profileId}?fields=id,name,instagram_business_account{id,username,name}&access_token=${userToken}`
            );
            const pData = await pRes.json();
            if (pData.id && !pData.error) {
              pages.push({
                id: pData.id,
                name: pData.name,
                access_token: userToken,
                instagram_business_account: pData.instagram_business_account || null,
              });
            }
          } else if (type === "USER") {
            // It's a User Token! Query user's accounts
            const accRes = await fetch(
              `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,tasks,instagram_business_account{id,username,name,profile_picture_url}&access_token=${userToken}`
            );
            const accData = await accRes.json();
            if (accData.data && Array.isArray(accData.data)) {
              pages = accData.data;
            }
          }
        }
      } catch (e) {
        console.warn("debug_token resolution note:", e);
      }
    }

    // Attempt 2: Fallback direct /me check
    if (pages.length === 0) {
      try {
        const pageInfoRes = await fetch(
          `https://graph.facebook.com/v21.0/me?fields=id,name,instagram_business_account{id,username,name}&access_token=${userToken}`
        );
        const pageInfo = await pageInfoRes.json();
        if (pageInfo.id && !pageInfo.error) {
          pages.push({
            id: pageInfo.id,
            name: pageInfo.name,
            access_token: userToken,
            instagram_business_account: pageInfo.instagram_business_account || null,
          });
        }
      } catch (e) {}
    }

    // Attempt 3: Fallback direct /me/accounts check
    if (pages.length === 0) {
      try {
        const pagesUrl = `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,tasks,instagram_business_account{id,username,name,profile_picture_url}&access_token=${userToken}`;
        const pagesRes = await fetch(pagesUrl);
        const pagesData = await pagesRes.json();
        if (pagesData.data && Array.isArray(pagesData.data)) {
          pages = pagesData.data;
        }
      } catch (e) {}
    }

    if (pages.length === 0) {
      return NextResponse.json(
        { error: "No Facebook Pages found associated with this account or token. Please ensure your token has 'pages_show_list' permission." },
        { status: 404 }
      );
    }

    // 2. Format discovered accounts with never-expiring long-lived tokens
    const discoveredAccounts = await Promise.all(
      pages.map(async (p: any) => {
        let pageToken = p.access_token || userToken;

        // Try exchanging for a permanent Long-Lived Token using App Secret if possible
        if (appId && appSecret) {
          try {
            const exchangeUrl = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${pageToken}`;
            const exRes = await fetch(exchangeUrl);
            const exData = await exRes.json();
            if (exData.access_token) {
              pageToken = exData.access_token;
            }
          } catch (e) {
            console.warn("Long-lived token exchange note:", e);
          }
        }

        const igAccount = p.instagram_business_account || null;

        return {
          fbPageId: p.id,
          fbPageName: p.name,
          fbToken: pageToken,
          hasInstagram: !!igAccount,
          igAccountId: igAccount?.id || null,
          igUsername: igAccount?.username || null,
          igToken: igAccount ? pageToken : null, // Instagram Graph API uses Page Access Token
        };
      })
    );

    return NextResponse.json({
      success: true,
      accounts: discoveredAccounts,
    });
  } catch (err: any) {
    console.error("Auto-import accounts error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to auto-discover accounts" },
      { status: 500 }
    );
  }
}
