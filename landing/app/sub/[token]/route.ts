import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { token: string } },
): Promise<NextResponse> {
  // token accepted, not used
  void params.token;
  return new NextResponse("vless://TEST-UUID@us.example.com:443#TEST-USA", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
