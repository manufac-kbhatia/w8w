import { prisma } from "@w8w/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const BodySchema = z.object({
  data: z.string(),
  type: z.string(),
  name: z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsedData = BodySchema.safeParse(body);
  if (!parsedData.success) {
    return NextResponse.json(
      { success: false, error: z.treeifyError(parsedData.error) },
      { status: 400 }
    );
  }

  const credential = await prisma.credential.create({ data: parsedData.data });
  return NextResponse.json({ credential }, { status: 200 });
}
