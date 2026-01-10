import { NextRequest, NextResponse } from "next/server";
import { inngest } from "../../../../../inngest/client";
import { prisma } from "@w8w/db/client";

// Opt out of caching; every request should send a new event
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await req.json()) as Record<string, unknown> | undefined;

  const webhookNode = await prisma.node.findUnique({
    where: {
      id,
    },
  });

  if (!webhookNode) {
    return NextResponse.json(
      {
        success: false,
        data: {
          message: "Webhook not found",
        },
      },
      { status: 404 },
    );
  }

  await inngest.send({
    name: "execute/workflow/webhook",
    data: {
      id: webhookNode.WorkflowId,
      webhookId: id,
      webhookApiData: body,
    },
  });

  return NextResponse.json({
    success: true,
    data: { message: "Workflow execution started" },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Convert query params to object
  const queryParams = Object.fromEntries(req.nextUrl.searchParams.entries());

  const webhookNode = await prisma.node.findUnique({
    where: {
      id,
    },
  });

  if (!webhookNode) {
    return NextResponse.json(
      {
        success: false,
        data: {
          message: "Webhook not found",
        },
      },
      { status: 404 },
    );
  }

  await inngest.send({
    name: "execute/workflow/webhook",
    data: {
      id: webhookNode.WorkflowId,
      webhookId: id,
      webhookApiData: queryParams,
    },
  });

  return NextResponse.json({
    success: true,
    data: { message: "Workflow execution started" },
  });
}
