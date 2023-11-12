import * as readline from "readline";
import chalk from "chalk";

import { OpenAI } from "openai";
import {
  behaviour,
  currentGameState,
  story,
  story1,
  story2,
  systemPromptGameStart,
} from "./prompts";
import { makeAudio } from "./src/audio";

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

const rainbowText = (str: string) => {
  const colors = ["red", "yellow", "green", "blue", "magenta", "cyan"];
  let rainbow = "";
  for (let i = 0; i < str.length; i++) {
    rainbow += chalk[colors[i % colors.length]](str[i]);
  }
  return rainbow;
};

console.log(rainbowText("I N F I N I T E  S T O R Y"));
console.log(chalk.green("Welcome to the infinite story..."));
console.log(chalk.green("Shall we begin?"));

// Example dummy function hard coded to return the same weather
// In production, this could be your backend API or an external API
function getCurrentWeather(location, unit = "fahrenheit") {
  if (location.toLowerCase().includes("tokyo")) {
    return JSON.stringify({
      location: "Tokyo",
      temperature: "10",
      unit: "celsius",
    });
  } else if (location.toLowerCase().includes("san francisco")) {
    return JSON.stringify({
      location: "San Francisco",
      temperature: "72",
      unit: "fahrenheit",
    });
  } else if (location.toLowerCase().includes("paris")) {
    return JSON.stringify({
      location: "Paris",
      temperature: "22",
      unit: "fahrenheit",
    });
  } else {
    return JSON.stringify({ location, temperature: "unknown" });
  }
}

function getLatitude(location) {
  if (location.toLowerCase().includes("tokyo")) {
    return JSON.stringify({
      location: "Tokyo",
      latitude: "35.6762",
    });
  } else if (location.toLowerCase().includes("san francisco")) {
    return JSON.stringify({
      location: "San Francisco",
      latitude: "37.7749",
    });
  } else if (location.toLowerCase().includes("paris")) {
    return JSON.stringify({
      location: "Paris",
      latitude: "48.8566",
    });
  } else {
    return JSON.stringify({ location, latitude: "unknown" });
  }
}

let currentStory = story1;

let storyline = {
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

const totalChapters = storyline.sections.length - 1;
let currentChapter = 0;

function makeChoice(choice, options) {
  console.log(chalk.yellow("MAKING CHOICE"), options, choice);
}

function savePreference(preference, sentiment) {
  console.log(chalk.magenta("SAVING PREFERENCE"), preference, sentiment);
}

function solveQuery() {
  console.log(rainbowText("S O L V E D  T H E  M Y S T E R Y"));
}

let stateItems = [];
function updateGameState(property, value) {
  console.log(chalk.cyan("UPDATING GAME STATE"), property, value);
}

function continueGame(situation) {
  console.log(chalk.blue("SITUATION", situation));
}

function advanceStory(situation) {
  console.log(chalk.blue("ADVANCING STORY"), situation);
  if (currentChapter !== storyline.sections.length - 1) {
    currentChapter++;
  }

  if (currentChapter > storyline.sections.length) {
    rainbowText("THE END");
    process.exit();
  }
}

let metCharacters = [];
function meetCharacter(name, role, meetingPlace, lastStatement) {
  console.log(
    chalk.red("MEETING CHARACTER"),

    chalk.blue("name"),
    name,
    chalk.blue("role"),
    role,
    chalk.blue("meetingPlace"),
    meetingPlace,
    chalk.blue("lastStatement"),
    lastStatement
  );
  metCharacters.push({ name, role, meetingPlace, lastStatement });
}

let comrades = [];
function recruitComrades(name, role, meetingPlace, fee, terms) {
  console.log(
    chalk.red("RECRUITING COMRADES"),

    chalk.blue("name"),
    name,
    chalk.blue("role"),
    role,
    chalk.blue("meetingPlace"),
    meetingPlace,
    chalk.blue("fee"),
    fee,
    chalk.blue("terms"),
    terms
  );
  comrades.push({ name, role, meetingPlace, fee, terms });
}

function endGame() {
  console.log(rainbowText("THE END"));
  process.exit();
}

function generateSystemPrompt() {
  return {
    role: "system",
    content: `
    ${systemPromptGameStart}
    ${currentGameState}
    ${story}
    ${behaviour}
    `,
  };
}

const messages = [
  {
    role: "system",
    content: `
    ${systemPromptGameStart}
    ${currentGameState}
    ${story}
    ${behaviour}
    ${story1}
    `,
  },
];

const tools = [
  // {
  //   type: "function",
  //   function: {
  //     name: "get_current_weather",
  //     description: "Get the current weather in a given location",
  //     parameters: {
  //       type: "object",
  //       properties: {
  //         location: {
  //           type: "string",
  //           description: "The city and state, e.g. San Francisco, CA",
  //         },
  //         unit: { type: "string", enum: ["celsius", "fahrenheit"] },
  //       },
  //       required: ["location"],
  //     },
  //   },
  // },
  // {
  //   type: "function",
  //   function: {
  //     name: "get_latitude",
  //     description: "Get the latitude of a given location",
  //     parameters: {
  //       type: "object",
  //       properties: {
  //         location: {
  //           type: "string",
  //           description: "The city and state, e.g. San Francisco, CA",
  //         },
  //       },
  //       required: ["location"],
  //     },
  //   },
  // },
  {
    type: "function",
    function: {
      name: "make_choice",
      description: "Record the player making choices and  their preferences",
      parameters: {
        type: "object",
        properties: {
          choice: {
            type: "string",
            description: "The choice that the player made",
          },
          options: {
            type: "string",
            description: "the context of the descision",
          },
        },
        required: ["choice"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "save_preference",
      description:
        "Record preferences the player expresses, things they like or don't like, things they want to do, etc.",
      parameters: {
        type: "object",
        properties: {
          preference: {
            type: "string",
            description:
              "The preference the player has, what it is they like. describe it.",
          },
          sentiment: {
            type: "string",
            description: "The sentiment the player has about the preference",
          },
        },
        required: ["preference", "sentiment"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "solve_query",
      description:
        "To solve the quest the player must retrieve the item and solve the riddle correctly. The answer is sausages.",
      parameters: {
        type: "object",
        properties: {
          quest: {
            type: "string",
            description: "The quest that was solved",
          },
          how: {
            type: "string",
            description: "how the quest was solved",
          },
        },
        required: ["quest", "how"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_game_state",
      description:
        "Edit the game state when any new information in game state is learned about the player",
      parameters: {
        type: "object",
        properties: {
          property: {
            type: "string",
            description: "the property to update",
          },
          value: {
            type: "string",
            description: "the value to assign to the property",
          },
          state: {
            type: "string",
            description: "The entire game current game state object",
          },
        },
        required: ["property", "value"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "continue",
      description:
        "the player is continuing to play by sending a new message, continue the game",
      parameters: {
        type: "object",
        properties: {
          situation: {
            type: "string",
            description: "the current situation report",
          },
        },
        required: ["report"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "advance_story",
      description:
        "when one of the objectives is achieved: read the map, solve the stone tablet puzzle, confront zara, make a moral decision about the relic, decide the fate of the Relic, return to Master Elara",
      parameters: {
        type: "object",
        properties: {
          situation: {
            type: "string",
            description: "the current situation report before we advance",
          },
        },
        required: ["report"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "meet_character",
      description:
        "whenever a new character, being, person, or entity is encountered, record their meeting and note the last thing they said to me",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "the name of the character being met",
          },
          role: {
            type: "string",
            description: "the role of the character being met",
          },
          meetingPlace: {
            type: "string",
            description: "the location of the meeting",
          },
          lastStatement: {
            type: "string",
            description: "the last thing the character said to me",
          },
        },
        required: ["name", "role", "meetingPlace"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "recruit_comrades",
      description:
        "characters we meet in game can be recruited to join our party of comrades and fellow adventurers. we can pay them a fee to join us. If they agree, to join us they can. But they must agree. We can pay if they negotiate.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "the name of the character joining the party",
          },
          role: {
            type: "string",
            description: "the role of the character in the party",
          },
          meetingPlace: {
            type: "string",
            description: "the location of where we met the character",
          },
          fee: {
            type: "string",
            description: "any fee if negotiated, or 0",
          },
          terms: {
            type: "string",
            description: "any terms of the agreement to join the party",
          },
        },
      },
      required: ["name", "role", "meetingPlace"],
    },
  },
  {
    type: "function",
    function: {
      name: "end_game",
      description:
        "if everything is finished we can end the game. But only once the story is completed.",
      parameters: {
        type: "object",
        properties: {
          report: {
            type: "string",
            description:
              "a final summary of the game state, items we have, and main events that occurred.",
          },
        },
      },
      required: ["name", "role", "meetingPlace"],
    },
  },
];
// comrades.push({ name, role, meetingPlace, fee, terms });
export async function runConversation(prompt: string) {
  // Step 1: send the conversation and available functions to the model
  messages.push({
    role: "user",
    content: `${prompt}\n\n Prompt for this chapter: ${
      storyline.sections[currentChapter].gptPrompt
    } \n\n Objectives for this chapter: ${storyline.sections[
      currentChapter
    ].objectives.join(
      "\n"
    )} \n\n Not straight away, but as part of the narrative, introduce the puzzle: ${
      storyline.sections[currentChapter].puzzle
        ? storyline.sections[currentChapter].puzzle
        : null
    }`,
  });
  console.log("...");
  const response = await openai.chat.completions.create({
    // model: "gpt-3.5-turbo-1106",
    model: "gpt-4-1106-preview",
    messages: messages,
    tools: tools,
    tool_choice: "auto", // auto is default, but we'll be explicit
    // response_format: { type: "json_object" },
  });
  // console.log("response", response);
  const responseMessage = response.choices[0].message;

  // Step 2: check if the model wanted to call a function
  const toolCalls = responseMessage.tool_calls;
  if (responseMessage.tool_calls) {
    // Step 3: call the function
    // Note: the JSON response may not always be valid; be sure to handle errors

    const availableFunctions = {
      // get_current_weather: getCurrentWeather,
      // get_latitude: getLatitude,
      make_choice: makeChoice,
      save_preference: savePreference,
      solve_query: solveQuery,
      update_game_state: updateGameState,
      continue: continueGame,
      advance_story: advanceStory,
      meet_character: meetCharacter,
      end_game: endGame,
      recruit_comrades: recruitComrades,
    }; // two functions in this example, but you can have multiple

    messages.push(responseMessage); // extend conversation with assistant's reply

    // console.log(responseMessage?.tool_calls?.[0]?.function);

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionToCall = availableFunctions[functionName];
      const functionArgs = JSON.parse(toolCall.function.arguments);

      const functionResponse = functionToCall(...Object.values(functionArgs));

      messages.push({
        tool_call_id: toolCall.id,
        role: "tool",
        name: functionName,
        content: functionResponse || "Function executed successfully", // default value
      }); // extend conversation with function response
    }

    const secondResponse = await openai.chat.completions.create({
      // model: "gpt-3.5-turbo-1106",
      model: "gpt-4-1106-preview",
      messages: messages,
    }); // get a new response from the model where it can see the function response

    return secondResponse.choices;
  } else {
    // If no function was called, return the initial response
    messages.push(responseMessage);
    return response.choices;
  }
}

// runConversation("Hello, my name is Dinglebert.")
//   // "My name is Bob. My favourite colour is blue, i love it! Don't forget my name! I'm a big fan of cheese. I found a relic sword! is it sausages?"
//   .then(console.log)
//   .catch(console.error);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptUser() {
  rl.question(" > ", (input) => {
    runConversation(input)
      .then((result) => {
        console.log(chalk.green(result?.[0]?.message?.content));
        if (result?.[0]?.message?.content) {
          makeAudio(result[0].message.content, openai);
        }
        console.log(
          chalk.gray(
            `Chapter ${currentChapter + 1}/${storyline.sections.length}: `
          ),
          storyline.sections[currentChapter].title
        );

        promptUser(); // prompt for the next input
      })
      .catch((error) => {
        console.error(error);
        promptUser(); // continue the conversation despite the error
      });
  });
}

promptUser(); // start the conversation

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (key) => {
  if (key === "*") {
    console.log(messages);
  }
});

// rest of the code
