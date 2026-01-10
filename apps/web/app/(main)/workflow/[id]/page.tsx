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
  IconSearch,
} from "@tabler/icons-react";
import Image from "next/image";
import { checkMannualTriggerExist, nodeTypes, transformNodes } from "@/utils";
import { NodeType, Prisma } from "@w8w/db/prisma-browser";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import { NodeSchema } from "@/types";
import { NodeSearch } from "@/components/node-search";
import FuzzySearch from "fuzzy-search";
import { ZoomSelect } from "@/components/zoom-select";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerNodes, setTriggerNodes] = useState<NodeSchema[]>([]);
  const [actionNodes, setActionNodes] = useState<NodeSchema[]>([]);
  const [loadingWokflow, setLoadingWorkflow] = useState(false);
  const [toggleInteractive, setToggleInteractive] = useState(true);
  const { fitView, zoomIn, zoomOut, screenToFlowPosition } = useReactFlow();
  const [showSearch, setShowSearch] = useState(false);

  const showExecute = useMemo(() => {
    return checkMannualTriggerExist(nodes);
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
      const { data } = await axios.get<{
        success: boolean;
        data: {
          workflow: Prisma.WorkflowGetPayload<{
            include: { nodes: true; connections: true };
          }>;
        };
      }>(`/api/workflow/${id}`);
      const transformedNodes = transformNodes(data.data.workflow.nodes, open);

      setLoadingWorkflow(false);
      setNodes(transformedNodes);
      setEdges(data.data.workflow.connections);
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
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;

    const position = screenToFlowPosition({
      x: x + (Math.random() - 0.5) * 200,
      y: y + (Math.random() - 0.5) * 200,
    });

    const newNode: Node = {
      id: uuidv4(),
      position: position,
      data: { nodeSchema },
      type: nodeSchema.nodeType,
    };
    setNodes((prev) => [
      ...prev.filter((node) => node.type !== NodeType.INITIAL),
      newNode,
    ]);
    close();
  };

  const handleExecuteWorkflow = async () => {
    const response = await axios.post(`/api/execute/manual/${id}`);
    console.log(response);
  };

  const searcher = new FuzzySearch(
    nodes,
    ["data.parameters.name", "data.nodeSchema.name"],
    {
      caseSensitive: false,
    },
  );

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
          proOptions={{
            hideAttribution: true,
          }}
        >
          {showSearch && (
            <Panel
              className="flex gap-1 rounded-md bg-primary-foreground p-1 text-foreground"
              position="top-center"
            >
              <NodeSearch
                onSearch={(value) => {
                  const node = searcher.search(value);
                  console.log(node);
                  return node;
                }}
              />
            </Panel>
          )}
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
            <ActionIcon
              variant="subtle"
              radius="sm"
              onClick={() => setShowSearch((prev) => !prev)}
            >
              <IconSearch />
            </ActionIcon>
          </Controls>
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <ZoomSelect position="bottom-left" />
        </ReactFlow>
      </div>
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        title={
          <Title order={2} component={"div"}>
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
                <Group align="center" gap="xs" wrap="nowrap">
                  <ThemeIcon variant="white" size="xl">
                    <Image
                      src={node.iconUrl ?? ""}
                      alt={node.name}
                      width={30}
                      height={30}
                      style={{ borderRadius: 6 }}
                    />
                  </ThemeIcon>
                  <Stack gap={1}>
                    <Text fw={600}>{node.name}</Text>
                    <Text size="sm" c="dimmed">
                      {node.description}
                    </Text>
                  </Stack>
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
                <Group align="center" gap="xs" wrap="nowrap">
                  <ThemeIcon variant="white" size="xl">
                    <Image
                      src={node.iconUrl ?? ""}
                      alt={node.name}
                      width={30}
                      height={30}
                      style={{ borderRadius: 6 }}
                    />
                  </ThemeIcon>
                  <Stack gap={1}>
                    <Text fw={600}>{node.name}</Text>
                    <Text size="sm" c="dimmed">
                      {node.description}
                    </Text>
                  </Stack>
                </Group>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Drawer>
    </Fragment>
  );
}
