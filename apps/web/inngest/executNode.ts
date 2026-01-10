import {
  getExecutionFucntion,
  WorkflowState,
} from "@/app/executions/getExecutions";
import { NodeName } from "@/utils";
import { Realtime } from "@inngest/realtime";
import { Node } from "@w8w/db/prisma-client";
import { GetStepTools, Inngest } from "inngest";

export async function executeNode(
  nodeId: string,
  idToNode: Record<string, Node>,
  inDegrees: Record<string, number>,
  adjacencyList: Record<string, string[]>,
  step: GetStepTools<Inngest.Any>,
  publish: Realtime.PublishFn,
  workflowState: WorkflowState,
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
    publish,
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
              publish,
              updatedWorkflowState,
            ),
          );
        }
      }
    }
    await Promise.all(childTasks);
  }
}
