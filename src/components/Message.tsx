import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../types";

interface Props {
  message: ChatMessage;
  onToggleSilesian?: () => void;
}

export default function Message({ message, onToggleSilesian }: Props) {
  const isUser = message.role === "user";
  const content = message.showingSilesian && message.silesianContent
    ? message.silesianContent
    : message.content;

  return (
    <div className={`message ${isUser ? "message--user" : "message--assistant"}`}>
      {!isUser && <span className="message__avatar">⚡</span>}
      <div className="message__body">
        <div className="message__bubble">
          {isUser ? content : <ReactMarkdown>{content}</ReactMarkdown>}
        </div>
        {onToggleSilesian && (
          <button className="silesian-toggle" onClick={onToggleSilesian}>
            {message.showingSilesian ? "↩ Wróć do polskiego" : "⚡ Pokaż po śląsku"}
          </button>
        )}
      </div>
    </div>
  );
}
