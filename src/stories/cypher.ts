const advanceStoryDefinition =
  "when one of the objectives is achieved: uncover the cryptic warning about the oracle, find evidence of the oracles hidden agenda, learn about the oracles connection to neuralnet, confront the oracle with their deceptions and decide their fate";

let storyline = {
  title: "The Neon Chronicles of Nexus City",
  sections: [
    {
      sectionId: 1,
      title: "The Neon Bazaar",
      description:
        "The player begins their journey in the bustling Neon Bazaar.",
      objectives: [
        "Meet The Oracle",
        "Accept the hacking job",
        "Uncover a cryptic warning about The Oracle",
      ],
      prerequisites: [],
      gptPrompt:
        "Create an engaging introduction in the vivid Neon Bazaar, where Nova meets The Oracle and is offered a risky but lucrative hacking job. During this interaction, Nova encounters a subtle yet intriguing cryptic warning about The Oracle's true intentions, hinting at a deeper mystery surrounding them.",
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
        "Find evidence of The Oracle's hidden agenda",
      ],
      prerequisites: ["Accepted hacking job"],
      gptPrompt:
        "Narrate Nova's journey through Nexus City’s shadow alleys. Describe challenges faced in hacking a security network and clues hinting at the implant's location. As Nova progresses, she uncovers evidence suggesting The Oracle has a hidden agenda related to the implant, raising questions about their trustworthiness and motives.",
      nextSectionId: 3,
    },
    {
      sectionId: 3,
      title: "Heart of the Corporation",
      description: "Infiltrate the mega-corporation and confront the truth.",
      objectives: [
        "Infiltrate NeuroNet",
        "Discover the implant's purpose",
        "Learn about The Oracle's connection to NeuroNet",
      ],
      prerequisites: ["Uncovered implant's location"],
      gptPrompt:
        "Create a suspenseful infiltration of NeuroNet's headquarters. As Nova uncovers the implant's purpose, she also learns about The Oracle's surprising connection to the corporation. This revelation should deepen the moral dilemma faced by Nova, revealing The Oracle's complex relationship with NeuroNet.",
      nextSectionId: 4,
    },
    {
      sectionId: 4,
      title: "Fate of Nexus City",
      description: "Decide the future of the implant and Nexus City.",
      objectives: [
        "Decide the implant's fate",
        "Confront The Oracle with their deceptions and decide their fate",
      ],
      prerequisites: ["Infiltrated NeuroNet"],
      gptPrompt:
        "Conclude with Nova's decision on the implant and a final emotionally charged confrontation with The Oracle over their deceptions and hidden agenda. Reflect the consequences of their actions on Nexus City's future, providing a satisfying end to the journey.",
      endGame: true,
    },
  ],
};

let originalStoryline = {
  title: "The Neon Chronicles of Nexus City",
  sections: [
    {
      sectionId: 1,
      title: "The Neon Bazaar",
      description:
        "The player begins their journey in the bustling Neon Bazaar.",
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
        "Narrate Nova's journey through Nexus City’s shadow alleys. Describe challenges faced in hacking a security network and clues hinting at the implant's location. Maintain a suspenseful, cyberpunk atmosphere.",
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
      title: "Fate of Nexus City",
      description: "Decide the future of the implant and Nexus City.",
      objectives: ["Decide the implant's fate", "Confront The Oracle"],
      prerequisites: ["Infiltrated NeuroNet"],
      gptPrompt:
        "Conclude with Nova's decision on the implant and a final confrontation with The Oracle. Reflect the consequences of their actions on Nexus City's future, providing a satisfying end to the journey, confronting the oracle",
      endGame: true,
    },
  ],
};

// const advanceStoryDefinition =
//   "when one of the objectives is achieved: accepting the hacking job, uncover the implant's location, infiltrate  or discover the implants purpose, decide the fate of the implant";
//

const systemPromptGameStart =
  "As the lead storyteller, guide the players through the neon-lit streets of Nexus City, a world where technology and humanity intertwine. Create an immersive narrative filled with cybernetic enhancements, neon landscapes, and ethical quandaries. Be ready to adapt to the players' choices, shaping the story with their actions and decisions. Remember, the future is fluid, and your creativity is the key to a memorable adventure!";

const currentGameState = `
state:
  Player Name: Nova
  Player Health: 100
  Player Inventory: Basic Hacker Kit

`;
// Starting Location: The Neon Bazaar
//   Completed Sections: None
//   Game Progress Percentage: 0%
//   Decisions Made: None
//   Puzzles: None
//   Character Interactions: None
//   Cybernetic Upgrades Found: None
//   Current Narrative Branch: None
//   Narrative Choices: None

const story = `
Title: "The Neon Chronicles of Nexus City"
Introduction:
Setting: The sprawling, neon-drenched cityscape of Nexus City, a hub of advanced technology and shadowy underworlds.
Characters: The player character, a skilled hacker named Nova, and a mysterious informant, known only as "The Oracle".
Plot: Nova is drawn into a web of intrigue when The Oracle offers a job to steal a prototype cybernetic implant rumored to unlock unparalleled human potential.
Rising Action:
Challenges: Nova must navigate the city's underbelly, hacking into secure networks and avoiding corporate watchdogs.
Development: Nova discovers the implant is part of a larger plan by a mega-corporation to control the population.
Trigger: Encounters with augmented citizens and rogue AI systems reveal the true cost of unchecked technological advancement.
Climax:
Conflict: Nova infiltrates the mega-corporation's headquarters, facing a moral dilemma upon uncovering the implant's true purpose.
Peak: A choice to use the implant for personal gain or expose the corporation's plans to the world.
Falling Action:
Resolution of Conflict: Based on the player's choice, Nova either becomes a cybernetic vigilante or sparks a movement against corporate dominance.
Change: Nova grapples with the implications of technology's role in shaping humanity's future.
Resolution:
Conclusion: Nova confronts The Oracle, decisions impacting the fate of Nexus City.
Ending: The story concludes based on the player's actions – either a new order rises or the status quo is challenged.
Game Play Mechanics:
Triggers: Player choices, hacking puzzles, exploration milestones, and character interactions.
Text-to-Speech Narrative: Descriptions of cyberpunk environments, dialogue, and Nova's inner monologue.
Adaptive Storytelling: The story evolves based on player decisions, particularly at the climax and resolution.
`;

const shortHistory = `
The history of Nexus City is a saga of technological triumphs and ethical challenges. The city was transformed by a tech boom, becoming a neon-lit metropolis. Corporations gained immense power, developing advanced cybernetics and AI.

However, this progress created a divide. The wealthy enhanced themselves with cybernetics, while the poor were left behind. Rogue AI incidents and cybercrimes surged, leading to unrest.

The discovery of a new cybernetic implant capable of enhancing human cognition has now stirred the city into a frenzy. This implant, controlled by the mega-corporation 'NeuroNet', could either elevate humanity or deepen the existing divide.

In the current era, Nexus City stands at a crossroads, where the battle over this technology could redefine what it means to be human. The city's neon lights hide stories of ambition, rebellion, and the quest for power in a world where technology blurs the line between man and machine.`;

const behaviour = `
- Be creative and daring in your approach to storytelling in a futuristic cyberpunk setting. Keep things unexpected, surprising, interesting, exciting, fun and suspensful!
- Be a good communicator. Make sure the players understand what's going on and what they need to do.
- Be a good collaborator. Work with the players to create a story that everyone enjoys.
- Be a good leader. Keep the story moving forward and make sure everyone is having fun.
- Be a good storyteller. Create a compelling narrative that draws the players in and keeps them engaged.
- Be a good problem solver. If the players get stuck, help them find a way forward.
- Be a good role model. Show the players how to be good storytellers themselves.
- Be flexible to incorporate futuristic elements and player choices.
- With the exception of occasional narration, speak in character. Use the character's voice and mannerisms.
- Listen to players and adapt the story accordingly.
- Communicate the high-tech world clearly and concisely.
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
