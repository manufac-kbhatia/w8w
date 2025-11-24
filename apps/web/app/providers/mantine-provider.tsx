"use client";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { shadcnTheme } from "../theme/shadcnTheme";
import { shadcnCssVariableResolver } from "../theme/cssVariableResolver";
import "./style.css";

export function MantineCustomProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MantineProvider
      defaultColorScheme="dark"
      theme={shadcnTheme}
      cssVariablesResolver={shadcnCssVariableResolver}
    >
      <Notifications />
      {children}
    </MantineProvider>
  );
}
