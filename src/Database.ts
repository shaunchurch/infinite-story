import { StateData } from "./GameController";

export interface GameStorage {
  saveState(state: StateData): Promise<void>;
  loadState(): Promise<StateData>;
}

export class Database implements GameStorage {
  async saveState(state: StateData): Promise<void> {
    // Save state to the database
    console.log("State saved:", state);
  }

  async loadState(): Promise<StateData> {
    // Load state from the database
    // Placeholder implementation
    return {
      /* state data */
    };
  }
}
