import { GameStateInterface, StateData } from "./GameController";
import { PlayerAction } from "./PlayerInputProcessor";

export class GameState implements GameStateInterface {
  private state: StateData;

  constructor() {
    this.state = {
      // Initial state setup
      playerName: "",
      playerHealth: 100,
      playerInventory: [],
      currentLocation: "StartPoint",
      completedSections: [],
      gameProgressPercentage: 0,
      decisionsMade: {},
      puzzles: {},
      characterInteractions: {},
      relicsFound: [],
      currentNarrativeBranch: "",
      narrativeChoices: [],
    };
  }

  updateState(action: PlayerAction): void {
    // Logic to update the state based on the action
    switch (action.type) {
      case "move":
        this.state.currentLocation = action.payload;
        break;
      case "takeItem":
        this.state.playerInventory.push(action.payload);
        break;
      // Add other cases as needed
      default:
        break;
    }
    // Further state update logic
  }

  getState(): StateData {
    return this.state;
  }

  loadState(loadedState: StateData): void {
    this.state = loadedState;
  }
}
