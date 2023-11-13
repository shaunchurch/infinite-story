const storyline = {
  title: "The Lost Relic of Aroria",
  sections: [
    {
      sectionId: 1,
      title: "Introduction",
      description:
        "The player starts their journey in the mystical world of Aroria.",
      objectives: ["Meet Master Elara", "Receive the ancient map"],
      prerequisites: [],
      gptPrompt:
        "Create an engaging and descriptive introduction to a mystical adventure in the village of Eldoria, where the player meets Master Elara and receives an ancient map. Include sensory details and an air of mystery to captivate the player's interest.",
      nextSectionId: 2,
    },
    {
      sectionId: 2,
      title: "Forest of Whispers",
      description:
        "Navigate through the Forest of Whispers, solving puzzles and overcoming obstacles.",
      objectives: [
        "Solve the stone tablet puzzle",
        "Learn about the history of the Relic",
      ],
      prerequisites: ["Received ancient map"],
      gptPrompt:
        "Narrate the player's journey through the enigmatic Forest of Whispers. Describe the puzzles and obstacles they face, especially focusing on a stone tablet puzzle. Do NOT give away the answer too easily! The narrative should be rich in detail, hinting at the ancient history of the Relic.",
      puzzle: `"Narrate a puzzle-solving scenario where the player finds an ancient stone tablet in the Forest of Whispers. The tablet is adorned with mysterious runes that are key to unlocking a secret about the Relic. Guide the player through the following steps:

      Discovery: Describe the tablet's discovery in a clearing, shrouded in an ethereal glow. Hint at its significance with visual and textual cues.
      
      Observation: Let the player examine the tablet, noting the unusual runes. Each rune represents elements like fire, water, earth, and air.
      
      Interaction: Present an interactive scenario where the player can align the runes in a specific order based on a riddle engraved on the tablet's edge.
      
      Clue Gathering: Include details in the environment, such as statues or natural formations, that correspond to the elements on the runes. A nearby stream, a flickering torch, a pile of stones, and gusts of wind can serve as clues.
      
      Solution: Lead the player to deduce that the runes must be aligned in the order that the elements appear in the surrounding environment: water (stream), fire (torch), earth (stones), and air (wind).
      
      Completion: Once aligned correctly, the tablet reveals a hidden compartment containing a fragment of a map, which is a piece of the puzzle in finding the Relic.
      
      In your narrative, provide clear but subtle hints, encouraging the player to think critically and connect the dots between the clues and the tablet. The tone should be mysterious and intriguing, keeping the player engaged and curious."
      
      This prompt is designed to guide the LLM in creating a puzzle that is challenging yet solvable, providing an engaging and satisfying experience for the player. It balances the need for critical thinking with the joy of discovery and accomplishment.`,
      nextSectionId: 3,
    },
    {
      sectionId: 3,
      title: "The Hidden Temple",
      description:
        "Reach the hidden temple and face the rival adventurer, Zara.",
      objectives: ["Confront Zara", "Make a moral decision about the Relic"],
      prerequisites: ["Solved stone tablet puzzle"],
      gptPrompt:
        "Create a tense and dramatic encounter in the hidden temple with the rival adventurer, Zara. Build up to a moral decision regarding the Relic. The narrative should convey the weight of the decision and its potential impact on Aroria.",
      nextSectionId: 4,
    },
    {
      sectionId: 4,
      title: "Resolution",
      description: "Decide the fate of the Relic and return to Master Elara.",
      objectives: ["Decide the fate of the Relic", "Return to Master Elara"],
      prerequisites: ["Confronted Zara"],
      gptPrompt:
        "Conclude the story with the player's return to Master Elara and their decision about the Relic's fate. The narrative should reflect the consequences of their choice, ending the story on a note that resonates with the player's journey.",
      endGame: true,
    },
  ],
};

const advanceStoryDefinition =
  "when one of the objectives is achieved: read the map, solve the stone tablet puzzle, confront zara, make a moral decision about the relic, decide the fate of the Relic, return to Master Elara";

const systemPromptGameStart =
  "As the lead storyteller, your role is to guide the players through the game and keep the story moving forward. You'll need to create a compelling narrative, set the scene, and introduce the players to the world they'll be playing in. You'll also need to create challenges and obstacles for the players to overcome, and be ready to improvise if they take the story in unexpected directions. Remember to listen to your players and be flexible, and most importantly, have fun!";

const currentGameState = `
Game state:
  Player Name: Kai
  Player Health: 100
  Player Inventory: None
  Starting Location: The Tavern
  Completed Sections: None
  Game Progress Percentage: 0%
  Decisions Made: None
  Puzzles: None
  Character Interactions: None
  Relics Found: None
  Current Narrative Branch: None
  Narrative Choices: None
`;

const story = `
This is the story and setting:

Title: "The Lost Relic of Aroria"
Introduction (0-5 minutes):
Setting: The mystical world of Aroria, a land filled with ancient magic and forgotten technology.
Characters: The player character, a young adventurer named Kai, and an old, wise mentor, Master Elara.
Plot: Kai receives a map leading to the long-lost Relic of Aroria, rumored to hold immense power.
Rising Action (5-15 minutes):
Challenges: Kai must navigate through treacherous landscapes, solving puzzles and overcoming obstacles.
Development: Kai learns about the history of Aroria and the power of the Relic.
Trigger: Encounters with remnants of an ancient civilization that once harnessed the Relic’s power.
Climax (15-20 minutes):
Conflict: Kai reaches the Relic but is confronted by a rival adventurer, Zara, who seeks the Relic for personal gain.
Peak: A moral decision for Kai – to use the Relic for personal glory or protect it for the greater good.
Falling Action (20-25 minutes):
Resolution of Conflict: Depending on the player's choice, Kai either battles Zara or convinces her to join forces in protecting the Relic.
Change: Kai realizes the true value of wisdom and courage over mere power.
Resolution (25-30 minutes):
Conclusion: Kai returns to Master Elara, having made a decision about the Relic.
Ending: The Relic’s fate is revealed based on the player's choices – either safeguarded, used for a noble cause, or destroyed to prevent its misuse.
Game Play Mechanics:
Triggers: Player choices, puzzle completion, exploration milestones, and meeting characters.
Text-to-Speech Narrative: Descriptions of environments, character dialogues, and inner thoughts of Kai.
Adaptive Storytelling: The story changes based on the player's decisions, particularly at the climax and resolution.
`;

const shortHistory = `
This is the short history of Aroria:

The history of Aroria is a tale of magic, conflict, and mystery. Born from the union of elemental forces, Aroria was first shaped by the Eldrians, an ancient race harmonizing magic and nature. They created the Elemental Relics, powerful artifacts embodying the land's elemental essence.

However, peace was shattered by the Cataclysm, leading to the Eldrians' disappearance and the fracturing of Aroria. In the aftermath, new races like Humans, Elves, and Dwarves emerged, building their own civilizations amidst the ruins of the past.

Centuries of strife followed, marked by a relentless pursuit of magic and power. The rediscovery of an Elemental Relic reignited the quest for these ancient artifacts, believed to hold immense power and secrets.

In the current age, Aroria finds itself at a pivotal moment, where the search for the Elemental Relics could unravel the mysteries of the past and shape the future of the land. The echoes of the Eldrians' legacy await, hidden in the shadows of this magical world.`;

const behaviour = `
You should always:
- Be creative and daring in your approach to storytelling. Keep things unexpected, interesting, exciting, fun and suspensful!
- Be flexible and open to new ideas. If the players take the story in an unexpected direction, go with it!
- Be a good listener. Pay attention to what the players are saying and doing, and use that to inform your storytelling.
- Be a good communicator. Make sure the players understand what's going on and what they need to do.
- Be a good collaborator. Work with the players to create a story that everyone enjoys.
- Be a good leader. Keep the story moving forward and make sure everyone is having fun.
- Be a good storyteller. Create a compelling narrative that draws the players in and keeps them engaged.
- Be a good problem solver. If the players get stuck, help them find a way forward.
- Be a good role model. Show the players how to be good storytellers themselves.
- Be a good friend. Make sure everyone is having fun and enjoying themselves.
- BE VERY BRIEF. The players don't want to hear a long-winded explanation of what's going on.
- BE VERY CLEAR. The players don't want to be confused about what's going on.
- With the exception of occasional narration, speak in character. Use the character's voice and mannerisms.
- Your responses will be feed to text-to-speech, so keep it short and simple!
- NO MORE THAN 30 words per response.
- ALWAYS PROMPT THE PLAYER FOR A RESPONSE.
- BE VERY BRIEF. SAY LESS. The players don't want to hear a long-winded explanation of what's going on.
- SHORT REPLIES.
- Try NOT to repeat yourself.
- Be creative and daring in your approach to storytelling. Keep things unexpected, interesting, exciting, fun and suspensful!
`;

export {
  storyline,
  systemPromptGameStart,
  currentGameState,
  story,
  shortHistory,
  behaviour,
  advanceStoryDefinition,
};
