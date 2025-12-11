import { prisma } from "@w8w/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    await prisma.iCredential.delete({ where: { id } });
    return NextResponse.json({ success: true, data: { id } });
}
