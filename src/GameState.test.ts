import { describe, it, expect } from "vitest";
import { GameState } from "./GameState";

describe("GameState", () => {
  it("should initialize with default values", () => {
    const gameState = new GameState();
    const state = gameState.getState();
    expect(state.playerName).toBe("");
    expect(state.playerHealth).toBe(100);
    // ... other default state assertions ...
  });

  it("should update location correctly", () => {
    const gameState = new GameState();
    gameState.updateState({ type: "move", payload: "NewLocation" });
    expect(gameState.getState().currentLocation).toBe("NewLocation");
  });

  it("should add item to inventory correctly", () => {
    const gameState = new GameState();
    gameState.updateState({ type: "takeItem", payload: "MagicSword" });
    expect(gameState.getState().playerInventory).toContain("MagicSword");
  });

  // ... additional tests for other actions ...
});
