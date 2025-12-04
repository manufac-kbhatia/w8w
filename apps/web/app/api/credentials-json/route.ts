import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "app/lib",
    "credentials-json/credentials.json",
  );
  const fileData = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(fileData);
  return NextResponse.json({ credentialSchemas: data });
}
