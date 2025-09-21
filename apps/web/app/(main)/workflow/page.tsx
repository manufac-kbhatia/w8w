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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { INodeType } from "@w8w/types";
import Image from "next/image";
import { CustomNodeData, CustomNodeType, nodeTypes } from "@/utils";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [nodes, setNodes] = useState<CustomNodeType[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerNodes, setTriggerNodes] = useState<CustomNodeData[]>([]);
  const [actionNodes, setActionNodes] = useState<CustomNodeData[]>([]);

  useEffect(() => {
    const getNodesJson = async () => {
      const response = await axios.get<CustomNodeData[]>("/api/nodes-json");
      const { triggers, actions } = response.data.reduce(
        (acc, node) => {
          if (node.nodeType === "trigger") acc.triggers.push(node);
          else if (node.nodeType === "action") acc.actions.push(node);
          return acc;
        },
        { triggers: [] as CustomNodeData[], actions: [] as CustomNodeData[] },
      );

      setTriggerNodes(triggers);
      setActionNodes(actions);
    };

    getNodesJson();
  }, []);

  const onNodesChange: OnNodesChange<CustomNodeType> = useCallback(
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

  const addNode = (node: INodeType) => {
    const newNode: CustomNodeType = {
      id: uuidv4(),
      position: { x: 100 * (nodes.length + 1), y: 0 },
      data: node,
      type: "custom",
    };
    setNodes((prev) => [...prev, newNode]);
    close();
  };

  console.log(edges);

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
            <ActionIcon variant="light" onClick={open}>
              <IconPlus size={40} />
            </ActionIcon>
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
