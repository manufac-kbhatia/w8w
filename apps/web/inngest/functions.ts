import { GetStepTools, Inngest, NonRetriableError } from "inngest";
import { inngest } from "./client";
import { prisma } from "@w8w/db/client";
import { getAdjList, getInDegrees, NodeName } from "@/utils";
import { INode } from "@w8w/db/prisma-client";
import {
  getExecutionFucntion,
  WorkflowState,
} from "@/app/executions/getExecutions";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "execute/workflow" },
  async ({ event, step }) => {
    const workflowId = event.data.id as string | undefined;
    if (!workflowId) {
      throw new NonRetriableError("Workflow id not provided");
    }

    const workflow = await step.run("Fetch workflow", async () => {
      const workflow = await prisma.iWorkflow.findUnique({
        where: { id: workflowId },
      });
      if (!workflow) {
        throw new NonRetriableError("Workflow not found");
      }

      return workflow;
    });

    // TODO: Check if the workflow is cyclic or not

    const idToNode = await step.run("Prepare id-to-node map", () => {
      const idToNode: Record<string, INode> = {};
      workflow.nodes.forEach((node) => {
        idToNode[node.id] = node;
      });
      return idToNode;
    });

    const adjacencyList = await step.run("Prepare adjacency list", () =>
      getAdjList(workflow.connections)
    );
    const inDegrees = await step.run("Prepare InDegrees for each edges", () =>
      getInDegrees(workflow.connections)
    );

    const workflowState: WorkflowState = {};

    const inDegreesEntry = Object.entries(inDegrees);
    for (const [nodeId, inDegree] of inDegreesEntry) {
      if (inDegree === 0) {
        await executeNode(
          nodeId,
          idToNode,
          inDegrees,
          adjacencyList,
          step,
          workflowState
        );
      }
    }

    return workflowState;
  }
);

export async function executeNode(
  nodeId: string,
  idToNode: Record<string, INode>,
  inDegrees: Record<string, number>,
  adjacencyList: Record<string, string[]>,
  step: GetStepTools<Inngest.Any>,
  workflowState: WorkflowState
) {
  // Get the node
  const node = idToNode[nodeId];
  if (!node) {
    return;
  }

  // Get the node name
  const nodeName = (
    node.data?.nodeSchema as Record<string, unknown> | undefined
  )?.["name"] as NodeName;

  // Get the execution function
  const executionFunction = getExecutionFucntion(nodeName);

  // Start execution asyncronously
  const updatedWorkflowState = await executionFunction({
    node,
    workflowState,
    step,
  });

  // Get children node and execute the same process again
  const childNodeIds = adjacencyList[nodeId];
  const childTasks: Promise<unknown>[] = [];
  if (childNodeIds) {
    for (const childNodeId of childNodeIds) {
      let inDegree = inDegrees[childNodeId];
      if (inDegree !== undefined) {
        inDegree--;
        inDegrees[childNodeId] = inDegree;

        if (inDegree === 0) {
          childTasks.push(
            executeNode(
              childNodeId,
              idToNode,
              inDegrees,
              adjacencyList,
              step,
              updatedWorkflowState
            )
          );
        }
      }
    }
    await Promise.all(childTasks);
  }
}
