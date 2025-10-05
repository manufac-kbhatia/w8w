"use client";
import { createWorkflow, TABS } from "@/utils";
import {
  ActionIcon,
  AppShell,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconAutomaticGearboxFilled,
  IconHome,
  IconKey,
  IconPlus,
  IconProgressCheck,
  IconRoute,
} from "@tabler/icons-react";
import { redirect, usePathname } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();

  return (
    <AppShell
      header={{ height: 50 }}
      navbar={{ width: 70, breakpoint: "xs" }}
      padding="md"
    >
      <AppShell.Header>
        <Text>This is header</Text>
      </AppShell.Header>
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
              onClick={() => redirect(`/?tab=${TABS.workflow}`)}
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
              onClick={() => redirect(`/?tab=${TABS.credential}`)}
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
              onClick={() => redirect(`/?tab=${TABS.executions}`)}
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
