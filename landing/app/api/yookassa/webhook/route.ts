import { NextRequest, NextResponse } from "next/server";
import { Pool, PoolClient } from "pg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

const shopId = process.env.YOOKASSA_SHOP_ID;
const secretKey = process.env.YOOKASSA_SECRET_KEY;
const allowUnauth = process.env.YOOKASSA_WEBHOOK_ALLOW_UNAUTH === "true";
const subscriptionDurationDays = parseInt(process.env.SUBSCRIPTION_DURATION_DAYS || "30", 10);

function isAuthorized(request: NextRequest): boolean {
  if (allowUnauth) {
    return true;
  }
  if (!shopId || !secretKey) {
    return false;
  }
  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Basic ")) {
    return false;
  }
  const decoded = Buffer.from(header.replace("Basic ", ""), "base64").toString("utf-8");
  const [user, pass] = decoded.split(":");
  return user === shopId && pass === secretKey;
}

async function ensureVpnUser(client: PoolClient, userId: string): Promise<void> {
  const exists = await client.query("SELECT 1 FROM vpn_users WHERE user_id = $1 LIMIT 1", [userId]);
  if (exists.rowCount && exists.rows.length > 0) {
    return;
  }
  await client.query("INSERT INTO vpn_users (user_id, vpn_uuid) VALUES ($1, gen_random_uuid())", [userId]);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

type YooKassaPayload = {
  object?: {
    id?: string;
    status?: string;
    metadata?: Record<string, string>;
  };
  id?: string;
  status?: string;
  metadata?: Record<string, string>;
};

let payload: YooKassaPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const paymentObject = payload?.object || payload;
  if (!paymentObject?.id) {
    return NextResponse.json({ ok: false, error: "no_payment_id" }, { status: 400 });
  }

  if (paymentObject.status !== "succeeded") {
    return NextResponse.json({ ok: true, skipped: true, reason: "not_succeeded" });
  }

  const providerPaymentId: string = paymentObject.id;
  const metadata = paymentObject.metadata || {};
  const metadataUserId: string | undefined = metadata.user_id;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let paymentUserId: string | undefined;
    if (providerPaymentId) {
      const paymentResult = await client.query(
        "UPDATE payments SET status = 'succeeded' WHERE provider_payment_id = $1 RETURNING user_id",
        [providerPaymentId],
      );
      if (paymentResult.rowCount && paymentResult.rows[0]?.user_id) {
        paymentUserId = paymentResult.rows[0].user_id;
      }
    }

    const targetUserId = metadataUserId || paymentUserId;
    if (!targetUserId) {
      await client.query("ROLLBACK");
      return NextResponse.json({ ok: false, error: "user_not_found" }, { status: 400 });
    }

    const latestSub = await client.query(
      "SELECT id FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
      [targetUserId],
    );

    const expiresInterval = `${subscriptionDurationDays} days`;

    if ((latestSub?.rowCount ?? 0) > 0) {
      await client.query(
        "UPDATE subscriptions SET status='active', started_at=NOW(), expires_at=NOW() + $2::interval WHERE id=$1",
        [latestSub.rows[0].id, expiresInterval],
      );
    } else {
      await client.query(
        "INSERT INTO subscriptions (user_id, status, plan, started_at, expires_at) VALUES ($1, 'active', 'default', NOW(), NOW() + $2::interval)",
        [targetUserId, expiresInterval],
      );
    }

    await ensureVpnUser(client, targetUserId);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("YooKassa webhook error:", error);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  } finally {
    client.release();
  }

  return NextResponse.json({ ok: true });
}
