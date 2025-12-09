import { NodeType } from "@w8w/db/prisma-client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@w8w/db/client";

export async function GET() {
  const workflows = await prisma.workflow.findMany();
  return NextResponse.json({ success: true, data: { workflows } });
}

export async function POST() {
  const workflow = await prisma.workflow.create({
    data: {
      connections: [],
      nodes: [
        {
          id: uuidv4(),
          type: NodeType.INITIAL,
          position: { x: 0, y: 0 },
          name: "Inital Node",
        },
      ],
    },
  });

  return NextResponse.json(
    { success: true, data: { id: workflow.id } },
    { status: 200 },
  );
}
