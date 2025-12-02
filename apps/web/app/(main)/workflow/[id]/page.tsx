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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import { CustomNodeType, InitialNodeType, nodeTypes } from "@/utils";
import { use } from "react";
import { NodeType, Workflow } from "@w8w/db/prisma-browser";
import { NodeSchema } from "@w8w/types";
import { v4 as uuidv4 } from "uuid";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [opened, { open, close }] = useDisclosure(false);
    const [triggerNodes, setTriggerNodes] = useState<NodeSchema[]>([]);
    const [actionNodes, setActionNodes] = useState<NodeSchema[]>([]);

    const showExecute = useMemo(() => {
        const isMannualTriggerExist = nodes.find((node) => node.type === "CUSTOM" && (node as CustomNodeType).data.nodeSchema.type === "w8w-nodes-base.manualTrigger");
        return isMannualTriggerExist ? true : false
    }, [nodes])

    useEffect(() => {
        const getNodesJson = async () => {
            const response = await axios.get<NodeSchema[]>("/api/nodes-json");
            const { triggers, actions } = response.data.reduce(
                (acc, node) => {
                    if (node.executionType === "trigger") acc.triggers.push(node);
                    else if (node.executionType === "action") acc.actions.push(node);
                    return acc;
                },
                { triggers: [] as NodeSchema[], actions: [] as NodeSchema[] }
            );

            setTriggerNodes(triggers);
            setActionNodes(actions);
        };

        getNodesJson();
    }, []);

    useEffect(() => {
        const getWorkflow = async () => {
            const { data } = await axios.get<{ workflow: Workflow }>(
                `/api/workflow/${id}`
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
                        data: { nodeSchema: node.data.nodeSchema as unknown as NodeSchema },
                    };
                }

                return transformedNode;
            });

            setNodes(transformedNodes);
            setEdges(data.workflow.connections);
        };

        getWorkflow();
    }, [id, open]);

    const onNodesChange: OnNodesChange<Node> = useCallback(
        (changes) =>
            setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        []
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange<Edge>[]) =>
            setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        []
    );

    const onConnect = useCallback(
        (params: Connection) =>
            setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        []
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

    const handleSave = async () => {
        const nodesToTransform = nodes as CustomNodeType[];
        const transformedNodes = nodesToTransform.map((node) => {
            if (node.type === NodeType.CUSTOM) {
                return {
                    id: node.id,
                    name: node.data.nodeSchema.name,
                    type: node.type,
                    data: node.data,
                    position: node.position as { x: number; y: number },
                };
            }
        });

        const transformedEdges = edges.map((edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle ?? "main",
            targetHandle: edge.targetHandle ?? "main",
        }));

        const saveWorkflow = {
            id,
            nodes: transformedNodes,
            connections: transformedEdges,
        };

        await axios.put("/api/workflow", saveWorkflow, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    };

    return (
        <Fragment>
            <div style={{ width: "100%", height: "100vh" }}>
                <ReactFlow
                    nodeTypes={nodeTypes}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                >
                    <Panel position="top-right">
                        <Group>
                            <Button onClick={handleSave}>Save</Button>
                            <ActionIcon variant="light" onClick={open}>
                                <IconPlus size={40} />
                            </ActionIcon>
                        </Group>
                    </Panel>
                    {showExecute && <Panel position="top-center">
                        <Button>Execute</Button>
                    </Panel>}
                    <Controls position="top-left" style={{ color: "black" }} />
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
