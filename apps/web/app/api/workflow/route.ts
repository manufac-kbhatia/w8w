import { NodeType, Workflow } from "@w8w/db/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@w8w/db/client";

export async function GET(): Promise<NextResponse<{ workflows: Workflow[] }>> {
    const workflows = await prisma.workflow.findMany();
    return NextResponse.json({ workflows });
}

export async function POST() {
    const workflow = await prisma.workflow.create({
        data: {
            connections: [],
            nodes: [
                {
                    id: uuidv4(),
                    type: NodeType.INITIAL,
                    position: { x: 0, y: 0 },
                    name: "Inital Node",
                    data: { nodeSchema: {} },
                },
            ],
        },
    });

    return NextResponse.json({ id: workflow.id }, { status: 200 });
}

export async function PUT(req: NextRequest) {
    try {
        const workflowToUpdate = await req.json();
        await prisma.workflow.update({
            where: {
                id: workflowToUpdate.id,
            },
            data: {
                nodes: workflowToUpdate.nodes,
                connections: workflowToUpdate.connections,
            },
        });

        return NextResponse.json({ success: true, data: { id: workflowToUpdate.id, message: `workflow with id: ${workflowToUpdate.id} updated successfully` } });
    } catch (error) {
        console.log(error);
        if (error instanceof Error)
            return NextResponse.json({ success: false, data: { message: error.message } })
    }
}
