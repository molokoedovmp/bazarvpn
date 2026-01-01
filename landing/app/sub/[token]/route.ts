import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

async function findVpnUuid(token: string): Promise<string | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT v.vpn_uuid
      FROM access_tokens t
      JOIN subscriptions s ON s.id = t.subscription_id
      JOIN vpn_users v ON v.user_id = s.user_id
      WHERE t.token = $1
        AND t.is_active = TRUE
        AND s.status = 'active'
        AND (s.expires_at IS NULL OR s.expires_at > NOW())
      LIMIT 1;
      `,
      [token],
    );
    if (result.rowCount && result.rows[0]?.vpn_uuid) {
      return result.rows[0].vpn_uuid as string;
    }
    return null;
  } finally {
    client.release();
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
): Promise<NextResponse> {
  const resolved = await params;
  const token = resolved?.token;
  if (!token) {
    return new NextResponse("forbidden", {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const vpnUuid = await findVpnUuid(token);
  if (!vpnUuid) {
    return new NextResponse("forbidden", {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const publicKey = "AhN6Vku_bbOZOwk1_Snr11qCLnVKuJ1V7jZw1HieyXo";

  const wifiProfile =
    `vless://${vpnUuid}@184.174.96.8:443` +
    `?security=reality&type=tcp&flow=xtls-rprx-vision` +
    `&pbk=${publicKey}&sni=www.cloudflare.com&fp=chrome` +
    `#USA-WiFi`;

  const mobileProfile =
    `vless://${vpnUuid}@184.174.96.8:8443` +
    `?security=reality&type=tcp` +
    `&pbk=${publicKey}&sni=www.cloudflare.com&fp=chrome` +
    `#USA-Mobile`;

  return new NextResponse(`${wifiProfile}\n${mobileProfile}`, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
