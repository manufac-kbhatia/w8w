export interface INode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  disabled?: boolean;
  retryOnFail?: boolean;
  maxTries?: number;
  waitBetweenTries?: number;
  alwaysOutputData?: boolean;
  executeOnce?: boolean;
  continueOnFail?: boolean;
  parameters: INodeParameters;
  credentials?: INodeCredentials;
  webhookId?: string;
}

export interface IConnections {
  // Node name
  [key: string]: INodeConnections;
}

export interface INodeConnections {
  // Input name : main
  [key: string]: NodeInputConnections;
}

export type NodeInputConnections = Array<IConnection[] | null>;

export interface IConnection {
  // The node the connection is to
  node: string;

  // The type of the input on destination node (for example "main")
  type: NodeConnectionType;

  // The output/input-index of destination node (if node has multiple inputs/outputs of the same type)
  index: number;
}

export type NodeConnectionType =
  (typeof NodeConnectionTypes)[keyof typeof NodeConnectionTypes];

export const NodeConnectionTypes = {
  Main: "main",
} as const;

export interface INodeCredentials {
  [key: string]: INodeCredentialsDetails; // key here is the name of credential
}

export interface INodeCredentialsDetails {
  id: string | null; // credentials id from db
  name: string; // name of the credential
}

export interface INodeParameters {
  [key: string]: NodeParameterValueType;
}

export type NodeParameterValueType =
  | NodeParameterValue
  | INodeParameters
  | NodeParameterValue[]
  | INodeParameters[];

export type NodeParameterValue = string | number | boolean | undefined | null;

export interface ICredentialType {
  name: string;
  displayName: string;
  iconUrl?: string;
  properties: INodeProperties[];
  documentationUrl?: string;
  supportedNodes?: string[];
}

export interface INodeProperties {
  id: string;
  displayName: string;
  name: string;
  type: NodePropertyType;
  options?: Array<INodeProperties>;
  description?: string;
  placeholder?: string;
  required?: boolean;
  default?: string;
}

export const NodePropertyTypes = {
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

export type NodePropertyType =
  (typeof NodePropertyTypes)[keyof typeof NodePropertyTypes];
