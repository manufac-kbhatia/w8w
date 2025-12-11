import { prisma } from "@w8w/db/client";
import { SupportedCredential } from "@w8w/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  if (name) {
    const credentials = await prisma.iCredential.findMany({
      where: {
        supportedNodes: {
          has: name,
        },
      },
      select: {
        id: true,
        data: {
          select: {
            credentialSchema: true,
            parameters: true,
          },
        },
      },
    });

    const supportedCredentials: SupportedCredential[] = credentials.map(
      (cred) => {
        const name =
          (cred.data?.parameters as Record<string, any> | undefined)?.[
            "name"
          ] ??
          (cred.data?.credentialSchema as Record<string, any> | undefined)?.[
            "name"
          ] ??
          "Unknown Credential";
        return {
          id: cred.id,
          name,
        };
      },
    );
    return NextResponse.json({ supportedCredentials }, { status: 200 });
  }
}
