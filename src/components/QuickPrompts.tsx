import { QUICK_PROMPTS } from "../types";

interface Props {
  onSelect: (prompt: string) => void;
  disabled: boolean;
}

export default function QuickPrompts({ onSelect, disabled }: Props) {
  return (
    <div className="quick-prompts">
      {QUICK_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          className="quick-prompts__btn"
          onClick={() => onSelect(prompt)}
          disabled={disabled}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
