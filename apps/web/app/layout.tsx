import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {
    mantineHtmlProps,
    ColorSchemeScript,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineCustomProvider } from "./providers/mantine-provider";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
});

export const metadata: Metadata = {
    title: "w8w",
    description: "Automate your workflows in w8w",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable}`}
                style={{ height: "100vh", overflow: "hidden" }}
            >
                <MantineCustomProvider>
                    {children}
                </MantineCustomProvider>
            </body>
        </html>
    );
}
