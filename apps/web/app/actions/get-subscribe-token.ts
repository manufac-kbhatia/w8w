// ex. /app/actions/get-subscribe-token.ts
"use server";

import { inngest } from "@/inngest/client";
import { getSubscriptionToken } from "@inngest/realtime";

export async function fetchRealtimeSubscriptionToken(
  workflowId: string,
  nodeId: string,
) {
  // This creates a token using the Inngest API that is bound to the channel and topic:
  const token = await getSubscriptionToken(inngest, {
    channel: `Workflow:${workflowId}`,
    topics: [`Node:${nodeId}`],
  });

  return token;
}
