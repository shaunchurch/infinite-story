import { describe, it, expect } from "vitest";
import { PlayerInputProcessor } from "./PlayerInputProcessor";

describe("PlayerInputProcessor", () => {
  it("should convert move input into move action", () => {
    const processor = new PlayerInputProcessor();
    const action = processor.process("move to NewLocation");
    expect(action.type).toBe("move");
    expect(action.payload).toBe("NewLocation");
  });

  it("should convert take item input into takeItem action", () => {
    const processor = new PlayerInputProcessor();
    const action = processor.process("pick up MagicSword");
    expect(action.type).toBe("takeItem");
    expect(action.payload).toBe("MagicSword");
  });

  // ... additional tests for other types of inputs ...
});
