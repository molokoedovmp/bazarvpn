import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
): Promise<NextResponse> {
  // token accepted, not used
  void (await params);
  return new NextResponse("vless://TEST-UUID@us.example.com:443#TEST-USA", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
