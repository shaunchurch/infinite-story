export type PlayerAction = {
  type: string;
  payload: any;
};

export class PlayerInputProcessor {
  process(input: string): PlayerAction {
    // Process input into a game action
    // Placeholder implementation
    return { type: "action", payload: input };
  }
}
