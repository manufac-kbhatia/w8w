import { NextRequest, NextResponse } from "next/server";
import { inngest } from "../../../../inngest/client";

// Opt out of caching; every request should send a new event
export const dynamic = "force-dynamic";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    await inngest.send({
        name: "execute/workflow",
        data: {
            id,
        },
    });

    return NextResponse.json({ success: true, data: { message: "Workflow execution started" } });

}