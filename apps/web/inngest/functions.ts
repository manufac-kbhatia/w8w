import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { prisma } from "@w8w/db/client";
import { BaseNodeData, getAdjList, getInDegrees, NodeNames } from "@/utils";
import { Node } from "@w8w/db/prisma-client";
import { WorkflowState } from "@/app/executions/getExecutions";
import { executeNode } from "./executNode";

export const executeWorkflowManual = inngest.createFunction(
  { id: "execute-workflow-manual" },
  { event: "execute/workflow/manual" },
  async ({ event, step, publish }) => {
    const workflowId = event.data.id as string | undefined;
    if (!workflowId) {
      throw new NonRetriableError("Workflow id not provided");
    }

    const workflow = await step.run("Fetch workflow", async () => {
      const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });
      if (!workflow) {
        throw new NonRetriableError("Workflow not found");
      }

      return workflow;
    });

    // TODO: Check if the workflow is cyclic or not

    const idToNode = await step.run("Prepare id-to-node map", () => {
      const idToNode: Record<string, Node> = {};
      workflow.nodes.forEach((node) => {
        idToNode[node.id] = node;
      });
      return idToNode;
    });

    const adjacencyList = await step.run("Prepare adjacency list", () =>
      getAdjList(workflow.connections),
    );
    const inDegrees = await step.run("Prepare InDegrees for each edges", () =>
      getInDegrees(workflow.connections),
    );

    const workflowState: WorkflowState = { workflowId };

    // const inDegreesEntry = Object.entries(inDegrees);

    const manualTriggerNode = workflow.nodes.find((node) => {
      const data = node.data as unknown as BaseNodeData;
      return data.nodeSchema?.name === NodeNames.Manual;
    });

    if (!manualTriggerNode) {
      throw new NonRetriableError("Manual Trigger not found");
    }

    await executeNode(
      manualTriggerNode.id,
      idToNode,
      inDegrees,
      adjacencyList,
      step,
      publish,
      workflowState,
    );
    return workflowState;
  },
);

export const executeWorkflowForm = inngest.createFunction(
  { id: "execute-workflow-form" },
  { event: "execute/workflow/form" },
  async ({ event, step, publish }) => {
    console.log("event", event);
    const formId = event.data.formId as string | undefined;
    const workflowId = event.data.id as string | undefined;
    const formValues = event.data.formValues as
      | Record<string, unknown>
      | undefined;

    if (!formId) {
      throw new NonRetriableError("Form id not provided");
    }
    if (!workflowId) {
      throw new NonRetriableError("Workflow id not provided");
    }
    if (!formValues) {
      throw new NonRetriableError("Form data not provided");
    }
    const workflow = await step.run("Fetch workflow", async () => {
      const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });
      if (!workflow) {
        throw new NonRetriableError("Workflow not found");
      }

      return workflow;
    });

    // TODO: Check if the workflow is cyclic or not

    const idToNode = await step.run("Prepare id-to-node map", () => {
      const idToNode: Record<string, Node> = {};
      workflow.nodes.forEach((node) => {
        idToNode[node.id] = node;
      });
      return idToNode;
    });

    const adjacencyList = await step.run("Prepare adjacency list", () =>
      getAdjList(workflow.connections),
    );
    const inDegrees = await step.run("Prepare InDegrees for each edges", () =>
      getInDegrees(workflow.connections),
    );

    // const inDegreesEntry = Object.entries(inDegrees);

    const formNodeTrigger = workflow.nodes.find((node) => node.id === formId);
    const formData = formNodeTrigger?.data as unknown as BaseNodeData;
    const workflowState: WorkflowState = {
      workflowId,
      [formData.parameters?.name as string]: formValues,
    };

    await executeNode(
      formId,
      idToNode,
      inDegrees,
      adjacencyList,
      step,
      publish,
      workflowState,
    );

    return workflowState;
  },
);

export const executeWorkflowWebhook = inngest.createFunction(
  { id: "execute-workflow-webhook" },
  { event: "execute/workflow/webhook" },
  async ({ event, step, publish }) => {
    console.log("event", event);
    const webhookId = event.data.webhookId as string | undefined;
    const workflowId = event.data.id as string | undefined;
    const webhookApiData = event.data.webhookApiData as
      | Record<string, unknown>
      | undefined;

    if (!webhookId) {
      throw new NonRetriableError("Webhook id not provided");
    }
    if (!workflowId) {
      throw new NonRetriableError("Workflow id not provided");
    }

    const workflow = await step.run("Fetch workflow", async () => {
      const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });
      if (!workflow) {
        throw new NonRetriableError("Workflow not found");
      }

      return workflow;
    });

    // TODO: Check if the workflow is cyclic or not

    const idToNode = await step.run("Prepare id-to-node map", () => {
      const idToNode: Record<string, Node> = {};
      workflow.nodes.forEach((node) => {
        idToNode[node.id] = node;
      });
      return idToNode;
    });

    const adjacencyList = await step.run("Prepare adjacency list", () =>
      getAdjList(workflow.connections),
    );
    const inDegrees = await step.run("Prepare InDegrees for each edges", () =>
      getInDegrees(workflow.connections),
    );

    const webhookTrigger = workflow.nodes.find((node) => node.id === webhookId);
    const webhookData = webhookTrigger?.data as unknown as BaseNodeData;
    const workflowState: WorkflowState = {
      workflowId,
      [webhookData.parameters?.name as string]: webhookApiData,
    };

    await executeNode(
      webhookId,
      idToNode,
      inDegrees,
      adjacencyList,
      step,
      publish,
      workflowState,
    );

    return workflowState;
  },
);
