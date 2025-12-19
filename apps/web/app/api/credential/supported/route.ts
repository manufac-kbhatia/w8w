import { CredentialData, SupportedCredential } from "@/types";
import { prisma } from "@w8w/db/client";

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
          ((cred.data as unknown as CredentialData).parameters?.name as
            | string
            | undefined) ??
          ((cred.data as unknown as CredentialData).credentialSchema?.name as
            | string
            | undefined) ??
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
