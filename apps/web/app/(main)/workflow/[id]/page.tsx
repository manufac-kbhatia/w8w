"use client";
import "@xyflow/react/dist/style.css";
import { useState, useCallback, useEffect, Fragment } from "react";
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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import { CustomNodeType, InitialNodeType, nodeTypes } from "@/utils";
import { use } from "react";
import { NodeType, Workflow } from "@w8w/db";
import { NodeSchema } from "@w8w/types";
import { v4 as uuidv4 } from "uuid";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerNodes, setTriggerNodes] = useState<NodeSchema[]>([]);
  const [actionNodes, setActionNodes] = useState<NodeSchema[]>([]);

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
    setNodes((prev) => [...prev, newNode]);
    close();
  };

  const handleSave = () => {
    const nodesToTransform = nodes as CustomNodeType[];
    console.log(nodes);
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

    console.log(transformedNodes);
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
          <Panel position="top-right" style={{ background: "white" }}>
            <Group>
              <Button onClick={handleSave}>Save</Button>
              <ActionIcon variant="light" onClick={open}>
                <IconPlus size={40} />
              </ActionIcon>
            </Group>
          </Panel>
          <Controls position="top-left" />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        title={<Title component={"div"}>What happens next?</Title>}
      >
        <Text>Triggers</Text>
        <Stack>
          {triggerNodes.map((node) => (
            <Card
              withBorder
              key={node.name}
              style={{ cursor: "pointer" }}
              onClick={() => addNode(node)}
            >
              <Group>
                <Image
                  src={node.iconUrl ?? ""}
                  alt={node.name}
                  width={40}
                  height={40}
                />
                <Text>{node.displayName}</Text>
              </Group>
              <Text>{node.description}</Text>
            </Card>
          ))}
        </Stack>

        <Text>Actions</Text>
        <Stack>
          {actionNodes.map((node) => (
            <Card withBorder key={node.name}>
              <Card.Section
                onClick={() => addNode(node)}
                style={{ cursor: "pointer" }}
              >
                <Group>
                  <Image
                    src={node.iconUrl ?? ""}
                    alt={node.name}
                    width={40}
                    height={40}
                  />
                  <Text>{node.displayName}</Text>
                </Group>
              </Card.Section>
              <Text>{node.description}</Text>
            </Card>
          ))}
        </Stack>
      </Drawer>
    </Fragment>
  );
}
