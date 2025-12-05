import { inngest } from "./client";

export const executeWorkflow = inngest.createFunction(
    { id: "execute-workflow" },
    { event: "execute/workflow" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "10s");
        return { message: `Hello ${event.data.id}!` };
    },
);