import { prisma } from "@w8w/db";
import { NextResponse } from "next/server";

export async function POST() {
  const workflow = await prisma.workflow.create({
    data: {
      connections: {},
      nodes: [],
    },
  });

  return NextResponse.json({ id: workflow.id }, { status: 200 });
}
