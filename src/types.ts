export type Language = "polish" | "english" | "silesian";

export type Role = "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
  silesianContent?: string;
  showingSilesian?: boolean;
}

export const QUICK_PROMPTS = [
  "How much does kWh cost?",
  "How to save electricity?",
  "G11 or G12 for me?",
  "How much does a washing machine use?",
  "How to read my bill?",
];

export const ECO_LEVELS = [
  { min: 0, max: 3, label: "Śląski Oszczędny" },
  { min: 4, max: 8, label: "Energetyk" },
  { min: 9, max: Infinity, label: "Mistrz Prądu" },
];
