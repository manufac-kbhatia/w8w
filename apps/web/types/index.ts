import { NodeType } from "@w8w/db/prisma-browser";

export interface NodeSchema {
  name: string; // "displayName": "Manual Trigger",
  description?: string; // "description": "Runs the flow on clicking a button in w8w",
  executionType: "trigger" | "action"; //  "executionType": "trigger",
  nodeType: NodeType;
  properties: Properties[];
  requiredCredential?: boolean; // "requiredCredential": false,
  iconUrl?: string;
}

export interface CredentialSchema {
  name?: string;
  description?: string;
  documentationUrl?: string;
  properties?: Properties[];
  iconUrl?: string;
  supportedNodes?: string[];
}

export interface Credential {
  id: string;
  data?: CredentialData;
  supportedNodes?: string[];
  updatedAt?: Date;
  createdAt?: Date;
}

export interface CredentialData {
  credentialSchema?: CredentialSchema;
  parameters?: Record<string, unknown>;
}
export interface Properties {
  id: string;
  displayName: string;
  name: string;
  type: PropertyType;
  typeOptions?: {
    password?: boolean;
  };
  options?: Array<Properties>;
  description?: string;
  placeholder?: string;
  required?: boolean;
  default?: string;
  readOnly?: boolean;
}

export const PropertyTypes = {
  boolean: "boolean",
  button: "button",
  dateTime: "dateTime",
  json: "json",
  multiSelect: "options",
  number: "number",
  select: "option",
  string: "string",
  credentialsSelect: "credentialsSelect",
  filter: "filter",
  credentials: "credentials",
} as const;

export type PropertyType = (typeof PropertyTypes)[keyof typeof PropertyTypes];

export interface SupportedCredential {
  id: string;
  name: string;
}
