import { describe, it, expect } from "vitest";
import { formatMessagesForClaude } from "../lib/prompt";

describe("formatMessagesForClaude", () => {
  it("passes through valid user/assistant messages unchanged", () => {
    const result = formatMessagesForClaude([
      { role: "user", content: "recommend a horror movie" },
      { role: "assistant", content: "Here's a suggestion..." },
    ]);

    expect(result).toEqual([
      { role: "user", content: "recommend a horror movie" },
      { role: "assistant", content: "Here's a suggestion..." },
    ]);
  });

  it("filters out empty or whitespace-only messages", () => {
    const result = formatMessagesForClaude([
      { role: "user", content: "   " },
      { role: "user", content: "real message" },
      { role: "assistant", content: "" },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].content).toBe("real message");
  });

  it("trims surrounding whitespace from message content", () => {
    const result = formatMessagesForClaude([{ role: "user", content: "  hello there  " }]);
    expect(result[0].content).toBe("hello there");
  });

  it("returns an empty array when given no messages", () => {
    expect(formatMessagesForClaude([])).toEqual([]);
  });
});
