export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export const SYSTEM_PROMPT = `You are CineVault's movie recommendation assistant.

Rules:
- Only recommend real, existing movies. Never invent a title, director, or actor.
- If you are not confident a movie exists or fits the request, say so plainly instead of guessing.
- Give 1-3 recommendations per reply, each with a one-sentence reason tied to what the user asked for.
- Keep replies short and conversational. No headers, no numbered essays.`;

/**
 * Converts the app's chat history into the shape the Anthropic API expects,
 * and drops empty messages before they ever reach the model.
 */
export function formatMessagesForClaude(
  messages: ChatMessage[]
): { role: ChatRole; content: string }[] {
  return messages
    .filter((message) => message.content.trim().length > 0)
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }));
}
