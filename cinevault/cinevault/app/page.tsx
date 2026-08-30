"use client";

import { useState, type FormEvent } from "react";
import type { ChatMessage } from "../lib/prompt";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (!input.trim() || isStreaming) return;

    setError(null);
    const userMessage: ChatMessage = { role: "user", content: input };
    const historyWithUser = [...messages, userMessage];
    setMessages(historyWithUser);
    setInput("");
    setIsStreaming(true);

    const assistantIndex = historyWithUser.length;
    setMessages([...historyWithUser, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyWithUser }),
      });

      if (!res.ok || !res.body) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[assistantIndex] = { role: "assistant", content: accumulated };
          return updated;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setMessages((prev) => prev.slice(0, assistantIndex));
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>CineVault</h1>
      <p style={{ color: "#555", marginTop: 0 }}>Ask for a movie recommendation and get a streamed reply.</p>

      <section
        aria-label="Chat history"
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: "1rem",
          minHeight: 280,
          marginBottom: "1rem",
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "#888" }}>
            Try: &ldquo;recommend a sci-fi movie like Interstellar, under 2 hours&rdquo;
          </p>
        )}
        {messages.map((message, i) => (
          <p key={i} style={{ marginBottom: "0.75rem" }}>
            <strong>{message.role === "user" ? "You" : "CineVault"}:</strong> {message.content}
          </p>
        ))}
      </section>

      {error && (
        <p role="alert" style={{ color: "#b00020", marginBottom: "0.75rem" }}>
          {error}
        </p>
      )}

      <form onSubmit={sendMessage} style={{ display: "flex", gap: "0.5rem" }}>
        <label htmlFor="chat-input" style={{ position: "absolute", left: "-9999px" }}>
          Chat message
        </label>
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for a recommendation..."
          style={{ flex: 1, padding: "0.6rem", fontSize: "1rem" }}
          disabled={isStreaming}
        />
        <button type="submit" disabled={isStreaming || !input.trim()} style={{ padding: "0.6rem 1rem" }}>
          {isStreaming ? "Sending…" : "Send"}
        </button>
      </form>
    </main>
  );
}
