export const TABS = {
  workflow: "Workflow",
  credential: "Credentials",
  executions: "Executions",
} as const;

export type Tab = (typeof TABS)[keyof typeof TABS];
