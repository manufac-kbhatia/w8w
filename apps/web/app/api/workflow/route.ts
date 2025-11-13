import { NodeType, prisma } from "@w8w/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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
          data: {},
        },
      ],
    },
  });

  return NextResponse.json({ id: workflow.id }, { status: 200 });
}
