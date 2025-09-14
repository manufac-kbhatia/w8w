"use client";
import { useState } from "react";
import { FloatingIndicator, Stack, Tabs, Text, Title } from "@mantine/core";
import classes from "./Demo.module.css";
import { Credentials } from "@/components/credentials";
import { Tab, TABS } from "@/utils";

export default function Page() {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [tab, setTab] = useState<Tab>(TABS.credential);
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});
  const setControlRef = (val: Tab) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };

  return (
    <Stack>
      <Stack>
        <Title>Personal</Title>
        <Text c="dimmed">Workflows and credentials owned by you</Text>
      </Stack>
      <Tabs
        variant="none"
        value={tab}
        onChange={(tab: string | null) => {
          if (tab) setTab(tab as Tab);
        }}
      >
        <Tabs.List ref={setRootRef} className={classes.list}>
          <Tabs.Tab
            value={TABS.workflow}
            ref={setControlRef(TABS.workflow)}
            className={classes.tab}
          >
            {TABS.workflow}
          </Tabs.Tab>
          <Tabs.Tab
            value={TABS.credential}
            ref={setControlRef(TABS.credential)}
            className={classes.tab}
          >
            {TABS.credential}
          </Tabs.Tab>
          <Tabs.Tab
            value={TABS.executions}
            ref={setControlRef(TABS.executions)}
            className={classes.tab}
          >
            {TABS.executions}
          </Tabs.Tab>

          <FloatingIndicator
            target={tab ? controlsRefs[tab] : null}
            parent={rootRef}
            className={classes.indicator}
          />
        </Tabs.List>

        <Tabs.Panel value={TABS.workflow}>First tab content</Tabs.Panel>
        <Tabs.Panel value={TABS.credential}>
          <Credentials />
        </Tabs.Panel>
        <Tabs.Panel value={TABS.executions}>executions</Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
