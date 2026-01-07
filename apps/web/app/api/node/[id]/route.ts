import { prisma } from "@w8w/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const node = await prisma.node.findUnique({
      where: {
        id,
      },
    });
    if (!node) {
      return NextResponse.json(
        {
          success: false,
          data: {
            message: "Node not found",
          },
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: {
        node,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: {
          message:
            error instanceof Error ? error.message : "Something went wrong",
        },
      },
      { status: 500 }
    );
  }
}
