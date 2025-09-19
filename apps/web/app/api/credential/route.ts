import { MongoDbConnection } from "@/lib/DbInstance";
import { Credential } from "@w8w/typeorm";
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

  const client = await MongoDbConnection.getConnection();

  const credential = new Credential();
  credential.data = parsedData.data.data;
  credential.name = parsedData.data.name;
  credential.type = parsedData.data.type;

  const data = await client.manager.save(credential);

  return NextResponse.json({ credential: data }, { status: 200 });
}
