"use client";
import { ActionIcon, AppShell, Stack, Text, ThemeIcon } from "@mantine/core";
import {
  IconAutomaticGearboxFilled,
  IconHome,
  IconPlus,
} from "@tabler/icons-react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <ActionIcon variant="light">
            <IconHome size={20} />
          </ActionIcon>
          <ActionIcon variant="light">
            <IconPlus size={20} />
          </ActionIcon>
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
