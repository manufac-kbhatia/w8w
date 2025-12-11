import { prisma } from "@w8w/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const credential = await prisma.iCredential.create({
    data: {
      data: body.data,
      supportedNodes: body.supportedNodes,
    },
  });
  return NextResponse.json({ credential }, { status: 200 });
}

export async function GET() {
  const credentials = await prisma.iCredential.findMany();
  return NextResponse.json({ credentials }, { status: 200 });
}
