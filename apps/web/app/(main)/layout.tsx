"use client";
import ThemeToggle from "@/components/themeToggler";
import { createWorkflow, CustomNodeType, TABS } from "@/utils";
import {
    ActionIcon,
    AppShell,
    Button,
    Group,
    Stack,
    ThemeIcon,
    Tooltip,
    useMantineTheme,
} from "@mantine/core";
import {
    IconAutomaticGearboxFilled,
    IconHome,
    IconKey,
    IconPlus,
    IconProgressCheck,
    IconRoute,
} from "@tabler/icons-react";
import { NodeType } from "@w8w/db/prisma-client";
import { useReactFlow } from "@xyflow/react";
import axios from "axios";
import { useRouter, usePathname, useParams } from "next/navigation";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const path = usePathname();
    const router = useRouter();
    const theme = useMantineTheme();
    const { id } = useParams<{ id: string }>()
    const { getNodes, getEdges } = useReactFlow();

    const handleSave = async () => {
        const nodesToTransform = getNodes() as CustomNodeType[];
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

        const transformedEdges = getEdges().map((edge) => ({
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
        <AppShell
            header={{ height: 80 }}
            navbar={{ width: 70, breakpoint: "xs" }}
            padding="lg"
        >
            <AppShell.Header p="md">
                <Group justify="space-between">
                    <ThemeIcon variant="light" size="xl">
                        <IconAutomaticGearboxFilled />
                    </ThemeIcon>
                    <Group>
                        {id && <Button onClick={handleSave}>Save</Button>}
                        <ThemeToggle />
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <Stack>
                    <ThemeIcon variant="transparent">
                        <IconAutomaticGearboxFilled />
                    </ThemeIcon>
                    <Tooltip
                        label="Home"
                        transitionProps={{ transition: "pop-bottom-left", duration: 300 }}
                        color={theme.primaryColor}
                    >
                        <ActionIcon variant="light">
                            <IconHome size={20} />
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip
                        label="Create Workflow"
                        transitionProps={{ transition: "pop-bottom-left", duration: 300 }}
                        color={theme.primaryColor}
                    >
                        <ActionIcon
                            variant="light"
                            onClick={createWorkflow}
                            disabled={path.startsWith("/workflow")}
                        >
                            <IconPlus size={20} />
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip
                        label="Workflows"
                        transitionProps={{ transition: "pop-bottom-left", duration: 300 }}
                        color={theme.primaryColor}
                    >
                        <ActionIcon
                            variant="light"
                            onClick={() => router.push(`/?tab=${TABS.workflow}`)}
                        >
                            <IconRoute size={20} />
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip
                        label="Credentials"
                        transitionProps={{ transition: "pop-bottom-left", duration: 300 }}
                        color={theme.primaryColor}
                    >
                        <ActionIcon
                            variant="light"
                            onClick={() => router.push(`/?tab=${TABS.credential}`)}
                        >
                            <IconKey size={20} />
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip
                        label="Executions"
                        transitionProps={{ transition: "pop-bottom-left", duration: 300 }}
                        color={theme.primaryColor}
                    >
                        <ActionIcon
                            variant="light"
                            onClick={() => router.push(`/?tab=${TABS.executions}`)}
                        >
                            <IconProgressCheck size={20} />
                        </ActionIcon>
                    </Tooltip>
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main
                style={{
                    height: "100%",
                }}
            >
                {children}
            </AppShell.Main>
        </AppShell>
    );
}
