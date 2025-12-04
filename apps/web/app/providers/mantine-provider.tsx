"use client";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { MantineTheme } from "../theme";
import '@mantine/notifications/styles.css';

export function MantineCustomProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MantineProvider
            theme={MantineTheme}
        >
            <Notifications />
            {children}
        </MantineProvider>
    );
}
