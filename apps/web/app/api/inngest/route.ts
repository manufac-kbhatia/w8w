import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import {
  executeWorkflowForm,
  executeWorkflowManual,
  executeWorkflowWebhook,
} from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    executeWorkflowManual,
    executeWorkflowForm,
    executeWorkflowWebhook,
  ],
});
