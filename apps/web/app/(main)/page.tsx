"use client";
import { useEffect, useState } from "react";
import { Stack, Tabs, Text, Title } from "@mantine/core";
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
        classNames={{
          tab: "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer",
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
