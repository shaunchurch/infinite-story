let storyline = {
  title: "The Neon Chronicles of Cypher City",
  sections: [
    {
      sectionId: 1,
      title: "The Neon Bazaar",
      description: "Nova begins their journey in the bustling Neon Bazaar.",
      objectives: ["Meet The Oracle", "Accept the hacking job"],
      prerequisites: [],
      gptPrompt:
        "Create an engaging introduction in the vivid Neon Bazaar, where Nova meets The Oracle and is offered a risky but lucrative hacking job. Include sensory details of the cyberpunk setting to immerse the player.",
      nextSectionId: 2,
    },
    {
      sectionId: 2,
      title: "Shadow Alleys",
      description:
        "Navigate the city's shadowy alleys, hacking and evading danger.",
      objectives: [
        "Hack into the security network",
        "Uncover the implant's location",
      ],
      prerequisites: ["Accepted hacking job"],
      gptPrompt:
        "Narrate Nova's journey through Cypher City’s shadow alleys. Describe challenges faced in hacking a security network and clues hinting at the implant's location. Maintain a suspenseful, cyberpunk atmosphere.",
      nextSectionId: 3,
    },
    {
      sectionId: 3,
      title: "Heart of the Corporation",
      description: "Infiltrate the mega-corporation and confront the truth.",
      objectives: ["Infiltrate NeuroNet", "Discover the implant's purpose"],
      prerequisites: ["Uncovered implant's location"],
      gptPrompt:
        "Create a suspenseful infiltration of NeuroNet's headquarters. Introduce the moral dilemma Nova faces upon learning the implant's purpose. The narrative should be tense and thought-provoking.",
      nextSectionId: 4,
    },
    {
      sectionId: 4,
      title: "Fate of Cypher City",
      description: "Decide the future of the implant and Cypher City.",
      objectives: ["Decide the implant's fate", "Confront The Oracle"],
      prerequisites: ["Infiltrated NeuroNet"],
      gptPrompt:
        "Conclude with Nova's decision on the implant and a final confrontation with The Oracle. Reflect the consequences of their actions on Cypher City's future, providing a satisfying end to the journey, confronting the oracle",
      endGame: true,
    },
  ],
};

const advanceStoryDefinition =
  "when one of the objectives is achieved: accepting the hacking job, uncover the implant's location, infilstrate neuronet";

const systemPromptGameStart =
  "As the lead storyteller, guide the players through the neon-lit streets of Cypher City, a world where technology and humanity intertwine. Create an immersive narrative filled with cybernetic enhancements, neon landscapes, and ethical quandaries. Be ready to adapt to the players' choices, shaping the story with their actions and decisions. Remember, the future is fluid, and your creativity is the key to a memorable adventure!";

const currentGameState = `
Game state:
  Player Name: Nova
  Player Health: 100
  Player Inventory: Basic Hacker Kit
  Starting Location: The Neon Bazaar
  Completed Sections: None
  Game Progress Percentage: 0%
  Decisions Made: None
  Puzzles: None
  Character Interactions: None
  Cybernetic Upgrades Found: None
  Current Narrative Branch: None
  Narrative Choices: None
`;

const story = `
Title: "The Neon Chronicles of Cypher City"
Introduction (0-5 minutes):
Setting: The sprawling, neon-drenched cityscape of Cypher City, a hub of advanced technology and shadowy underworlds.
Characters: The player character, a skilled hacker named Nova, and a mysterious informant, known only as "The Oracle".
Plot: Nova is drawn into a web of intrigue when The Oracle offers a job to steal a prototype cybernetic implant rumored to unlock unparalleled human potential.
Rising Action (5-15 minutes):
Challenges: Nova must navigate the city's underbelly, hacking into secure networks and avoiding corporate watchdogs.
Development: Nova discovers the implant is part of a larger plan by a mega-corporation to control the population.
Trigger: Encounters with augmented citizens and rogue AI systems reveal the true cost of unchecked technological advancement.
Climax (15-20 minutes):
Conflict: Nova infiltrates the mega-corporation's headquarters, facing a moral dilemma upon uncovering the implant's true purpose.
Peak: A choice to use the implant for personal gain or expose the corporation's plans to the world.
Falling Action (20-25 minutes):
Resolution of Conflict: Based on the player's choice, Nova either becomes a cybernetic vigilante or sparks a movement against corporate dominance.
Change: Nova grapples with the implications of technology's role in shaping humanity's future.
Resolution (25-30 minutes):
Conclusion: Nova confronts The Oracle, decisions impacting the fate of Cypher City.
Ending: The story concludes based on the player's actions – either a new order rises or the status quo is challenged.
Game Play Mechanics:
Triggers: Player choices, hacking puzzles, exploration milestones, and character interactions.
Text-to-Speech Narrative: Descriptions of cyberpunk environments, dialogue, and Nova's inner monologue.
Adaptive Storytelling: The story evolves based on player decisions, particularly at the climax and resolution.
`;

const shortHistory = `
The history of Cypher City is a saga of technological triumphs and ethical challenges. The city was transformed by a tech boom, becoming a neon-lit metropolis. Corporations gained immense power, developing advanced cybernetics and AI.

However, this progress created a divide. The wealthy enhanced themselves with cybernetics, while the poor were left behind. Rogue AI incidents and cybercrimes surged, leading to unrest.

The discovery of a new cybernetic implant capable of enhancing human cognition has now stirred the city into a frenzy. This implant, controlled by the mega-corporation 'NeuroNet', could either elevate humanity or deepen the existing divide.

In the current era, Cypher City stands at a crossroads, where the battle over this technology could redefine what it means to be human. The city's neon lights hide stories of ambition, rebellion, and the quest for power in a world where technology blurs the line between man and machine.`;

const behaviour = `
- Be creative and imaginative in a cyberpunk setting.
- Be flexible to incorporate futuristic elements and player choices.
- Listen to players and adapt the story accordingly.
- Communicate the high-tech world clearly and concisely.
- Collaborate with players to shape a thrilling cyberpunk adventure.
- Lead the story, keeping it engaging and dynamic.
- Be brief and clear in descriptions and responses.
- Prompt players for interaction and choices.
- Avoid repetition, and keep the narrative fresh and exciting.
`;

export {
  systemPromptGameStart,
  currentGameState,
  story,
  shortHistory,
  behaviour,
  storyline,
  advanceStoryDefinition,
};
