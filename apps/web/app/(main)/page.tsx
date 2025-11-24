"use client";
import { useEffect, useState } from "react";
import { FloatingIndicator, Stack, Tabs, Text, Title } from "@mantine/core";
import classes from "./Tabs.module.css";
import { Credentials } from "@/components/credentials";
import { Tab, TABS } from "@/utils";
import { Workflows } from "@/components/workflows";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const [tab, setTab] = useState<Tab>(TABS.credential);

  const defaultTab = useSearchParams().get("tab");
  useEffect(() => {
    if (defaultTab) {
      setTab(defaultTab as Tab);
    }
  }, [defaultTab]);

  return (
    <Stack>
      <Stack>
        <Title>Personal</Title>
        <Text c="dimmed">Workflows and credentials owned by you</Text>
      </Stack>
      <Tabs
        variant="pills"
        value={tab}
        onChange={(tab: string | null) => {
          if (tab) setTab(tab as Tab);
        }}
      >
        <Tabs.List>
          <Tabs.Tab value={TABS.workflow}>{TABS.workflow}</Tabs.Tab>
          <Tabs.Tab value={TABS.credential}>{TABS.credential}</Tabs.Tab>
          <Tabs.Tab value={TABS.executions}>{TABS.executions}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={TABS.workflow}>
          <Workflows />
        </Tabs.Panel>
        <Tabs.Panel value={TABS.credential}>
          <Credentials />
        </Tabs.Panel>
        <Tabs.Panel value={TABS.executions}>executions</Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
