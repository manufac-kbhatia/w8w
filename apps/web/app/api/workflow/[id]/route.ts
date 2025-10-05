import { prisma, Workflow } from "@w8w/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ workflow: Workflow } | { message: string }>> {
  const { id } = await params;
  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
    },
  });
  if (!workflow) {
    return NextResponse.json(
      { message: "No workflow found with given id" },
      { status: 404 }
    );
  }
  return NextResponse.json({ workflow });
}
