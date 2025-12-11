import { INodeType } from "@w8w/db/prisma-client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@w8w/db/client";

export async function GET() {
    const workflows = await prisma.iWorkflow.findMany();
    return NextResponse.json({ success: true, data: { workflows } });
}

export async function POST() {
    const workflow = await prisma.iWorkflow.create({
        data: {
            connections: [],
            nodes: [
                {
                    id: uuidv4(),
                    nodeType: INodeType.INITIAL,
                    position: { x: 0, y: 0 },
                    data: { parameters: { name: "Initial node" } },
                },
            ],
        },
    });

    return NextResponse.json(
        { success: true, data: { id: workflow.id } },
        { status: 200 },
    );
}
