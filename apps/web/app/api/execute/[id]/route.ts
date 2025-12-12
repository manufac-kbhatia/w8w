import { NextRequest, NextResponse } from "next/server";
import { inngest } from "../../../../inngest/client";
import { prisma } from "@w8w/db/client";

// Opt out of caching; every request should send a new event
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const workflow = await prisma.iWorkflow.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      connections: true,
      nodes: true,
    },
  });

  if (!workflow) {
    return NextResponse.json(
      {
        success: false,
        data: {
          message: "Workflow not found",
        },
      },
      { status: 404 }
    );
  }

  await inngest.send({
    name: "execute/workflow",
    data: {
      id,
    },
  });

  return NextResponse.json({
    success: true,
    data: { message: "Workflow execution started" },
  });
}
