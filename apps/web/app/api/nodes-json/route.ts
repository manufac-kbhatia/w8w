import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "app/lib", "nodes-json/nodes.json");
  const fileData = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(fileData);
  return NextResponse.json(data);
}
