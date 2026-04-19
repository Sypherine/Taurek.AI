import { useEffect, useRef } from "react";
import type { ChatMessage } from "../types";
import Message from "./Message";

interface Props {
  messages: ChatMessage[];
  isLoading: boolean;
  onToggleSilesian: (index: number) => void;
}

export default function ChatWindow({ messages, isLoading, onToggleSilesian }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="chat-window">
      {messages.length === 0 && (
        <div className="chat-window__empty">
          Cześć! Jestem Taurek ⚡ Zapytaj mnie o prąd, taryfy lub faktury!
        </div>
      )}
      {messages.map((msg, i) => (
        <Message
          key={i}
          message={msg}
          onToggleSilesian={msg.silesianContent ? () => onToggleSilesian(i) : undefined}
        />
      ))}
      {isLoading && (
        <div className="message message--assistant">
          <span className="message__avatar">⚡</span>
          <div className="message__bubble message__bubble--typing">Taurek pisze...</div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
