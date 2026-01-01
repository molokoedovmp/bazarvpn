import { NextRequest } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

const vpnHost = process.env.VPN_SUB_HOST || "us-server.example.com";
const vpnPort = process.env.VPN_SUB_PORT || "443";

async function findActiveVpnUuid(token: string): Promise<string | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      WITH tok AS (
        SELECT subscription_id
        FROM access_tokens
        WHERE token = $1 AND is_active = TRUE
        LIMIT 1
      )
      SELECT v.vpn_uuid
      FROM tok
      JOIN subscriptions s ON s.id = tok.subscription_id
      JOIN vpn_users v ON v.user_id = s.user_id
      WHERE s.status = 'active'
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
): Promise<Response> {
  const resolved = await params;
  const token = resolved?.token;
  if (!token) {
    return new Response("", { status: 400 });
  }

  const vpnUuid = await findActiveVpnUuid(token);
  if (!vpnUuid) {
    return new Response("", { status: 403 });
  }

  const lines = [
    `vless://${vpnUuid}@${vpnHost}:${vpnPort}?security=reality&type=tcp#USA-VLESS`,
    `vless://${vpnUuid}@${vpnHost}:${vpnPort}?security=reality&type=grpc#USA-GRPC`,
  ];

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
