import { prisma } from "@w8w/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  if (name) {
    const supportedCredentials = await prisma.credential.findMany({
      where: {
        supportedNodes: {
          has: name,
        },
      },
      select: {
        data: {
          select: {
            credentialSchema: true,
          },
        },
      },
    });
    return NextResponse.json({ supportedCredentials }, { status: 200 });
  }
}
