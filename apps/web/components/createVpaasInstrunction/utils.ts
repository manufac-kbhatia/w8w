export type InstructionField = {
  fieldId: string;
  instructionName: Instrunction;
  config?: InstructionConfig;
};

export type InstructionConfig =
  | PlayInstruction
  | SpeakInstruction
  | DialInstruction
  | HangupInstruction;

export const Instrunctions = {
  Play: "Play",
  Speak: "Speak",
  Dial: "Dial",
  Hangup: "Hangup",
} as const;

export type Instrunction = (typeof Instrunctions)[keyof typeof Instrunctions];

export interface PlayInstruction {
  url: string;
}

export interface SpeakInstruction {
  voiceId: string;
  language: string;
  text: string;
}

export interface DialInstruction {
  credentialId: string;
  to: string;
}
export type HangupInstruction = Record<string, unknown>;

export function getDefaultConfig(instruction: Instrunction): InstructionConfig {
  switch (instruction) {
    case Instrunctions.Play:
      return { url: "" };
    case Instrunctions.Speak:
      return { voiceId: "", language: "", text: "" };
    case Instrunctions.Dial:
      return { to: "", credentialId: "" };
    case Instrunctions.Hangup:
      return {};
    default:
      return {};
  }
}

export function getPlayXml(config: PlayInstruction) {
  return `<Play>${config.url}</Play>`;
}

export function getSpeakXml(config: SpeakInstruction) {
  return `<Speak voiceId="${config.voiceId}" language="${config.language}" accountId={from-credential}>${config.text}</Speak>`;
}

export function getDialXml(config: DialInstruction) {
  return `<Dial trunk={from-credential} callerId={from-credential}>${config.to}</Dial>`;
}

export function getHangupXml() {
  return `<Hangup></Hangup>`;
}

export function getInstructionInXml(instructions: InstructionField[]) {
  return `<Response>
${instructions
  .map(({ instructionName, config }) => {
    if (instructionName === Instrunctions.Play) {
      return getPlayXml(config as PlayInstruction);
    } else if (instructionName === Instrunctions.Dial) {
      return getDialXml(config as DialInstruction);
    } else if (instructionName === Instrunctions.Speak) {
      return getSpeakXml(config as SpeakInstruction);
    } else if (instructionName === Instrunctions.Hangup) {
      return getHangupXml();
    }
  })
  .join(`\n`)}
</Response>
  `;
}
