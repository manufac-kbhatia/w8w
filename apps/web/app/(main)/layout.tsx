"use client";
import { ActionIcon, AppShell, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconAutomaticGearboxFilled, IconPlus } from "@tabler/icons-react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppShell
      header={{ height: 50 }}
      navbar={{ width: 70, breakpoint: "sm" }}
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
            <IconPlus />
          </ActionIcon>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
