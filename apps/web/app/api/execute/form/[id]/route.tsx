import { NextRequest, NextResponse } from "next/server";
import { inngest } from "../../../../../inngest/client";
import { prisma } from "@w8w/db/client";

// Opt out of caching; every request should send a new event
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await req.json()) as {
    formValues: Record<string, unknown> | undefined;
  };

  const formNode = await prisma.node.findUnique({
    where: {
      id,
    },
  });

  if (!formNode) {
    return NextResponse.json(
      {
        success: false,
        data: {
          message: "Form not found",
        },
      },
      { status: 404 }
    );
  }

  await inngest.send({
    name: "execute/workflow/form",
    data: {
      id: formNode.WorkflowId,
      formId: id,
      formValues: body.formValues ?? {},
    },
  });

  return NextResponse.json({
    success: true,
    data: { message: "Workflow execution started" },
  });
}
