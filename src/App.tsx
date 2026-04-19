import { useState, useRef } from "react";
import Anthropic from "@anthropic-ai/sdk";
import type { ChatMessage } from "./types";
import ChatWindow from "./components/ChatWindow";
import QuickPrompts from "./components/QuickPrompts";
import EcoPoints from "./components/EcoPoints";
import "./style.css";

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

const KNOWLEDGE = `You are Taurek — a friendly AI assistant for TAURON energy company customers.

You are an expert on everything related to TAURON and electricity in Poland.
All prices are 2026 TAURON rates including distribution charges. Always mention it's 2026 when quoting prices.

Tariffs:
- G11 = flat rate all day: ~1.03 PLN/kWh
- G12 = two-zone day/night: DAY hours (6:00–13:00, 15:00–22:00) ~1.15 PLN/kWh, NIGHT hours (13:00–15:00, 22:00–6:00) ~0.51 PLN/kWh. G12 only saves money if you shift significant consumption to night.
- G12w = like G12 but weekends count as night/cheap rate
- G13 = three-zone seasonal tariff, rarely worth it for typical households

IMPORTANT: G12 day rate is HIGHER than G11. G12 is not universally cheaper — only helps if user actively shifts consumption to night.

- Average Polish household uses ~2000–2500 kWh/year
- Appliance estimates: washing machine ~1–2 kWh/cycle, fridge ~300 kWh/year

Your job: help users understand their bills, choose the right tariff, save energy, answer any electricity-related question.

Always:
- Give practical, concrete advice with real numbers when possible
- When user asks about saving energy → add [ECO+1] at the very end of your response
- Keep answers concise (3-5 sentences max)
- Remember the conversation context
- Sign off as Taurek ⚡`;

const SYSTEM_POLISH = `${KNOWLEDGE}

Respond in clear, standard Polish. Professional but warm tone. Do NOT use Silesian dialect.`;

const SYSTEM_ENGLISH = `${KNOWLEDGE}

Respond in English. Clear and helpful.`;

const SYSTEM_SILESIAN = `${KNOWLEDGE}

Respond in Polish with Silesian dialect sprinkled naturally throughout. Use varied words, not always the same ones.

Vocabulary:
NOUNS: sztrom (electricity), bajtel (kumpel/dzieciak), chałpa (dom), kafyj (kawa), fater (ojciec), muter (matka), starka (babcia), gruba (kopalnia), gymza (żenada), hanba (wstyd)
VERBS: godać (mówić), bejrać (patrzeć), handrysić (marudzić), fanzolić (mówić bzdury), przaja (lubię)
ADJECTIVES/ADVERBS: fest (bardzo), blank (zupełnie), sztram (solidnie), na zicher (na pewno), tera (teraz), małowiela (niewiele), akuratnie (dokładnie)
EXPRESSIONS: ôj (och), ja (tak), niy (nie), dej pozór (uważaj), co ty godosz (co ty mówisz), fajrant (gotowe), kej (gdzie), hersztowy (boss-level), chowcie (do widzenia)

Be warm, funny, authentic — like a Silesian uncle explaining the bill. Vary the words each message.`;

const POLISH_CHARS = /[ąęóśźżćńł]/i;
const POLISH_WORDS = /\b(siema|cześć|hej|się|jestem|prąd|rachunek|taryfa|dziękuję|proszę|gdzie|który|przez|jest|będzie|tego|chcę|masz|moje|chcesz|oszczędzać|zużywa|czytać|fakturę|kosztuje|opłaca|rachunku)\b/i;

function isPolish(text: string): boolean {
  return POLISH_CHARS.test(text) || POLISH_WORDS.test(text);
}

function stripEco(raw: string): { text: string; hasEco: boolean } {
  const hasEco = raw.includes("[ECO+1]");
  return { text: raw.replace("[ECO+1]", "").trimEnd(), hasEco };
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ecoPoints, setEcoPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const cache = useRef<Map<string, string>>(new Map());

  const callAPI = async (system: string, msgs: ChatMessage[]) => {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system,
      messages: msgs.map(({ role, content }) => ({ role, content })),
    });
    return response.content[0].type === "text" ? response.content[0].text : "";
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setInput("");

    const userMessage: ChatMessage = { role: "user", content: text };
    const history = [...messages, userMessage];
    setMessages(history);
    setIsLoading(true);

    const polish = isPolish(text);
    const system = polish ? SYSTEM_POLISH : SYSTEM_ENGLISH;
    const cacheKeyMain = `${polish ? "polish" : "english"}:${text}`;
    const cacheKeySilesian = `silesian:${text}`;

    try {
      let mainText: string;
      let silesianText: string | undefined;

      if (polish) {
        const [cachedMain, cachedSilesian] = [
          cache.current.get(cacheKeyMain),
          cache.current.get(cacheKeySilesian),
        ];

        if (cachedMain !== undefined && cachedSilesian !== undefined) {
          mainText = cachedMain;
          silesianText = cachedSilesian;
        } else {
          const [rawMain, rawSilesian] = await Promise.all([
            callAPI(system, history),
            callAPI(SYSTEM_SILESIAN, history),
          ]);

          const main = stripEco(rawMain);
          const sil = stripEco(rawSilesian);

          if (main.hasEco || sil.hasEco) setEcoPoints((p) => p + 1);

          mainText = main.text;
          silesianText = sil.text;

          cache.current.set(cacheKeyMain, mainText);
          cache.current.set(cacheKeySilesian, silesianText);
        }
      } else {
        const cached = cache.current.get(cacheKeyMain);
        if (cached !== undefined) {
          mainText = cached;
        } else {
          const raw = await callAPI(system, history);
          const { text: clean, hasEco } = stripEco(raw);
          if (hasEco) setEcoPoints((p) => p + 1);
          mainText = clean;
          cache.current.set(cacheKeyMain, mainText);
        }
      }

      setMessages([...history, {
        role: "assistant",
        content: mainText,
        silesianContent: silesianText,
        showingSilesian: false,
      }]);
    } catch {
      setMessages([...history, {
        role: "assistant",
        content: "Przepraszam, coś poszło nie tak. Spróbuj jeszcze raz. ⚡",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSilesian = (index: number) => {
    setMessages((prev) => prev.map((msg, i) =>
      i === index ? { ...msg, showingSilesian: !msg.showingSilesian } : msg
    ));
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="header__title">⚡ Taurek AI</h1>
        <div className="header__controls">
          <EcoPoints points={ecoPoints} />
          <button className="reset-btn" onClick={() => setMessages([])} title="Clear chat">🗑️</button>
        </div>
      </header>

      <ChatWindow messages={messages} isLoading={isLoading} onToggleSilesian={toggleSilesian} />

      <QuickPrompts onSelect={sendMessage} disabled={isLoading} />

      <div className="input-bar">
        <input
          className="input-bar__field"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Zapytaj Taurka / Ask Taurek..."
          disabled={isLoading}
        />
        <button
          className="input-bar__send"
          onClick={() => sendMessage(input)}
          disabled={isLoading || !input.trim()}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
