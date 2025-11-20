"use client";
import { createWorkflow, TABS } from "@/utils";
import {
    ActionIcon,
    AppShell,
    Group,
    Stack,
    ThemeIcon,
    Tooltip,
    useMantineColorScheme,
    useMantineTheme,
} from "@mantine/core";
import {
    IconAutomaticGearboxFilled,
    IconHome,
    IconKey,
    IconMoon,
    IconPlus,
    IconProgressCheck,
    IconRoute,
    IconSun,
} from "@tabler/icons-react";
import { useRouter, usePathname } from "next/navigation";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const path = usePathname();
    const router = useRouter()


    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();
    return (
        <AppShell
            header={{ height: 80 }}
            navbar={{ width: 70, breakpoint: "xs" }}
            padding="lg"
        >
            <AppShell.Header p="md">
                <Group justify="space-between">
                    <ThemeIcon
                        variant="light"
                        size="xl"
                    >
                        <IconAutomaticGearboxFilled />
                    </ThemeIcon>
                    <ActionIcon onClick={toggleColorScheme} variant="light">
                        {
                            colorScheme === "dark" ? <IconSun /> : <IconMoon />
                        }
                    </ActionIcon>
                </Group>
            </AppShell.Header >
            <AppShell.Navbar p="md">
                <Stack>
                    <ThemeIcon variant="transparent">
                        <IconAutomaticGearboxFilled />
                    </ThemeIcon>
                    <Tooltip
                        label="Home"
                        transitionProps={{ transition: "pop-bottom-left", duration: 300 }}
                    >
                        <ActionIcon variant="light">
                            <IconHome size={20} />
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip
                        label="Create Workflow"
                        transitionProps={{ transition: "pop-bottom-left", duration: 300 }}
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
        </AppShell >
    );
}
