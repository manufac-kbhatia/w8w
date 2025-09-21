import { prisma } from "@w8w/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  console.log(id);

  await prisma.credential.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
