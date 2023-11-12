import { GameStorage } from "./Database";
import { NarrativeGenerator } from "./NarrativeGenerator";
import { PlayerAction, PlayerInputProcessor } from "./PlayerInputProcessor";

export interface GameStateInterface {
  updateState(action: PlayerAction): void;
  loadState(state: StateData): void; // New method
  getState(): StateData;
}

export type StateData = {
  // Player-specific data
  playerName: string;
  playerHealth: number;
  playerInventory: Array<string>; // List of items in the player's inventory

  // Game progress
  currentLocation: string; // The current location of the player in the game world
  completedSections: Array<string>; // Sections or chapters the player has completed
  gameProgressPercentage: number; // A rough estimate of how much of the game is completed

  // Decision tracking
  decisionsMade: {
    [key: string]: any; // Key-value pairs of decisions made and their outcomes
  };

  // Puzzle states
  puzzles: {
    [puzzleId: string]: {
      isSolved: boolean;
      currentClues: Array<string>; // Clues found related to this puzzle
    };
  };

  // Character interactions
  characterInteractions: {
    [characterName: string]: {
      hasMet: boolean;
      relationshipStatus: string; // e.g., ally, neutral, enemy
      lastInteraction: string; // Summary or key points from the last interaction
    };
  };

  // Special items or relics
  relicsFound: Array<string>; // Names of important relics that the player has found

  // Narrative-related elements
  currentNarrativeBranch: string; // The current narrative path the player is on
  narrativeChoices: Array<string>; // Choices made that significantly affect the narrative
};

export class GameController {
  private gameState: GameStateInterface;
  private narrativeGenerator: NarrativeGenerator;
  private playerInputProcessor: PlayerInputProcessor;
  private gameStorage: GameStorage;

  constructor(
    gameState: GameStateInterface,
    narrativeGenerator: NarrativeGenerator,
    playerInputProcessor: PlayerInputProcessor,
    gameStorage: GameStorage
  ) {
    this.gameState = gameState;
    this.narrativeGenerator = narrativeGenerator;
    this.playerInputProcessor = playerInputProcessor;
    this.gameStorage = gameStorage;
  }

  async processPlayerInput(input: string): Promise<void> {
    const action = this.playerInputProcessor.process(input);
    this.gameState.updateState(action);
    await this.gameStorage.saveState(this.gameState.getState());
  }

  generateNarrative(): string {
    return this.narrativeGenerator.generate(this.gameState.getState());
  }

  async loadGame(): Promise<void> {
    const loadedState: StateData = await this.gameStorage.loadState();
    this.gameState.loadState(loadedState); // Update to use a new method in GameState
  }

  // Additional methods...
}
