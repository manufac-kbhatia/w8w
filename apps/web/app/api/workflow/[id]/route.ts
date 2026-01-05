import { prisma } from "@w8w/db/client";
import { Prisma } from "@w8w/db/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const workflow = await prisma.workflow.findUnique({
      where: {
        id,
      },
      include: {
        nodes: true,
        connections: true,
      },
    });
    if (!workflow) {
      return NextResponse.json(
        {
          success: false,
          data: { message: "No workflow found with given id" },
        },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: { workflow } });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          data: { message: error.message },
        },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          data: { message: "Something went wrong!" },
        },
        { status: 500 },
      );
    }
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await req.json()) as {
      name?: string;
      nodes?: Prisma.NodeCreateManyInput[];
      connections?: Prisma.ConnectionCreateManyInput[];
    };

    await prisma.$transaction([
      // 1. Update workflow
      prisma.workflow.update({
        where: { id },
        data: {
          name: body.name,
        },
      }),

      // 2. Delete old nodes
      prisma.node.deleteMany({
        where: { WorkflowId: id },
      }),

      // 3. Delete old connections
      prisma.connection.deleteMany({
        where: { WorkflowId: id },
      }),

      // 4. Insert new nodes
      ...(body.nodes?.length
        ? [
            prisma.node.createMany({
              data: body.nodes.map((n) => ({
                ...n,
                WorkflowId: id,
              })),
            }),
          ]
        : []),

      // 5. Insert new connections
      ...(body.connections?.length
        ? [
            prisma.connection.createMany({
              data: body.connections.map((c) => ({
                ...c,
                WorkflowId: id,
              })),
            }),
          ]
        : []),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        id,
        message: "Workflow updated successfully",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const workflowExist = await prisma.workflow.findUnique({ where: { id } });

    if (!workflowExist) {
      return NextResponse.json(
        {
          success: false,
          data: {
            id,
            message: `workflow with id: ${id} not found`,
          },
        },
        { status: 404 },
      );
    }

    await prisma.workflow.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      data: {
        id,
        message: `workflow with id: ${id} deleted successfully`,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          data: { message: error.message },
        },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          data: { message: "Something went wrong!" },
        },
        { status: 500 },
      );
    }
  }
}
