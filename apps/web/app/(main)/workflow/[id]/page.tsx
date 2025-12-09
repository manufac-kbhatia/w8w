"use client";
import "@xyflow/react/dist/style.css";
import { useState, useCallback, useEffect, Fragment, useMemo } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  Background,
  Controls,
  BackgroundVariant,
  Panel,
  OnNodesChange,
  Edge,
  EdgeChange,
  Node,
  XYPosition,
  useReactFlow,
} from "@xyflow/react";
import axios from "axios";
import {
  Card,
  ActionIcon,
  Drawer,
  Group,
  Stack,
  Text,
  Title,
  Button,
  ThemeIcon,
  Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconLock,
  IconLockOpen,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import Image from "next/image";
import {
  CustomNodeData,
  CustomNodeType,
  InitialNodeType,
  nodeTypes,
} from "@/utils";
import { NodeType, Workflow } from "@w8w/db/prisma-browser";
import { NodeSchema } from "@w8w/types";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerNodes, setTriggerNodes] = useState<NodeSchema[]>([]);
  const [actionNodes, setActionNodes] = useState<NodeSchema[]>([]);
  const [loadingWokflow, setLoadingWorkflow] = useState(false);
  const [toggleInteractive, setToggleInteractive] = useState(true);
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  const showExecute = useMemo(() => {
    const isMannualTriggerExist = nodes.find(
      (node) =>
        node.type === "CUSTOM" &&
        (node as CustomNodeType).data.nodeSchema?.type ===
          "w8w-nodes-base.manualTrigger",
    );
    return isMannualTriggerExist ? true : false;
  }, [nodes]);

  useEffect(() => {
    const getNodesJson = async () => {
      const response = await axios.get<NodeSchema[]>("/api/nodes-json");
      const { triggers, actions } = response.data.reduce(
        (acc, node) => {
          if (node.executionType === "trigger") acc.triggers.push(node);
          else if (node.executionType === "action") acc.actions.push(node);
          return acc;
        },
        { triggers: [] as NodeSchema[], actions: [] as NodeSchema[] },
      );

      setTriggerNodes(triggers);
      setActionNodes(actions);
    };

    getNodesJson();
  }, []);

  useEffect(() => {
    setLoadingWorkflow(true);
    const getWorkflow = async () => {
      const { data } = await axios.get<{ workflow: Workflow }>(
        `/api/workflow/${id}`,
      );
      const transformedNodes = data.workflow.nodes.map((node) => {
        let transformedNode: InitialNodeType | CustomNodeType;
        if (node.type === NodeType.INITIAL) {
          transformedNode = {
            id: node.id,
            position: node.position as XYPosition,
            type: node.type,
            data:
              node.type === NodeType.INITIAL
                ? { onClick: open }
                : (node.data as Record<string, unknown>),
          } as InitialNodeType;
        } else {
          transformedNode = {
            id: node.id,
            position: node.position as XYPosition,
            type: node.type,
            data: node.data as unknown as CustomNodeData,
          };
        }

        return transformedNode;
      });

      setLoadingWorkflow(false);
      setNodes(transformedNodes);
      setEdges(data.workflow.connections);
    };

    getWorkflow();
  }, [id, open]);

  const onNodesChange: OnNodesChange<Node> = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const addNode = (nodeSchema: NodeSchema) => {
    const newNode: CustomNodeType = {
      id: uuidv4(),
      position: { x: 100 * (nodes.length + 1), y: 0 },
      data: { nodeSchema },
      type: NodeType.CUSTOM,
    };
    setNodes((prev) => [
      ...prev.filter((node) => node.type !== NodeType.INITIAL),
      newNode,
    ]);
    close();
  };

  const handleExecuteWorkflow = async () => {
    const response = await axios.post(`/api/execute/${id}`);
    console.log(response);
  };

  return (
    <Fragment>
      <div className="w-full h-full relative">
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodesDraggable={toggleInteractive}
          onConnect={onConnect}
          fitView
        >
          <Panel position="top-right">
            <ActionIcon variant="light" onClick={open}>
              <IconPlus size={40} />
            </ActionIcon>
          </Panel>
          {showExecute && (
            <Panel position="bottom-center">
              <Button onClick={handleExecuteWorkflow}>Execute</Button>
            </Panel>
          )}
          {loadingWokflow && (
            <Loader
              size="md"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1000"
            />
          )}
          <Controls
            position="top-left"
            showFitView={false}
            showZoom={false}
            showInteractive={false}
            className="p-1 flex flex-row gap-1"
          >
            <ActionIcon variant="subtle" radius="sm" onClick={() => zoomIn()}>
              <IconPlus />
            </ActionIcon>
            <ActionIcon variant="subtle" radius="sm" onClick={() => zoomOut()}>
              <IconMinus />
            </ActionIcon>
            <ActionIcon variant="subtle" radius="sm" onClick={() => fitView()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-scan"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 7v-1a2 2 0 0 1 2 -2h2" />
                <path d="M4 17v1a2 2 0 0 0 2 2h2" />
                <path d="M16 4h2a2 2 0 0 1 2 2v1" />
                <path d="M16 20h2a2 2 0 0 0 2 -2v-1" />
              </svg>
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              radius="sm"
              onClick={() => setToggleInteractive((prev) => !prev)}
            >
              {toggleInteractive ? <IconLockOpen /> : <IconLock />}
            </ActionIcon>
          </Controls>
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        title={
          <Title order={3} component={"div"}>
            What happens next?
          </Title>
        }
        padding="md"
        size="md"
      >
        {/* Trigger Section */}
        <Stack gap="sm">
          <Text fw={600} size="md">
            Triggers
          </Text>

          <Stack gap="sm">
            {triggerNodes.map((node) => (
              <Card
                key={node.name}
                radius="md"
                withBorder
                className="border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                shadow="sm"
                p="md"
                onClick={() => addNode(node)}
              >
                <Group align="center" gap="md">
                  <ThemeIcon variant="white" size="xl">
                    <Image
                      src={node.iconUrl ?? ""}
                      alt={node.name}
                      width={30}
                      height={30}
                      style={{ borderRadius: 6 }}
                    />
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>{node.displayName}</Text>
                    <Text size="sm" c="dimmed">
                      {node.description}
                    </Text>
                  </div>
                </Group>
              </Card>
            ))}
          </Stack>

          {/* Actions Section */}
          <Text fw={600} size="md" mt="lg">
            Actions
          </Text>

          <Stack gap="sm">
            {actionNodes.map((node) => (
              <Card
                key={node.name}
                withBorder
                className="border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                radius="md"
                shadow="sm"
                p="md"
                onClick={() => addNode(node)}
              >
                <Group align="center" gap="md">
                  <ThemeIcon variant="white" size="xl">
                    <Image
                      src={node.iconUrl ?? ""}
                      alt={node.name}
                      width={30}
                      height={30}
                      style={{ borderRadius: 6 }}
                    />
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>{node.displayName}</Text>
                    <Text size="sm" c="dimmed">
                      {node.description}
                    </Text>
                  </div>
                </Group>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Drawer>
    </Fragment>
  );
}
