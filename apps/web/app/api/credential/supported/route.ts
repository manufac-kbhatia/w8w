import { prisma } from "@w8w/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");
  if (type) {
    const supportedCredentials = await prisma.credential.findMany({
      where: {
        supportedNodes: {
          has: type,
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });
    return NextResponse.json({ supportedCredentials }, { status: 200 });
  }
}
