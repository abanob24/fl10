import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, formatMessagesForClaude, type ChatMessage } from "../../../lib/prompt";

export const runtime = "edge";

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(
      "Server misconfigured: ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the dev server.",
      { status: 500 }
    );
  }

  const anthropic = new Anthropic({ apiKey });

  let body: { messages: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid request body — expected JSON with a `messages` array.", {
      status: 400,
    });
  }

  const formatted = formatMessagesForClaude(body.messages ?? []);

  if (formatted.length === 0) {
    return new Response("No message content received.", { status: 400 });
  }

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: formatted,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode("\n\n[Error while streaming the response — check server logs.]")
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
