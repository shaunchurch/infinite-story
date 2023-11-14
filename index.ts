import * as readline from "readline";
import chalk from "chalk";
import { OpenAI } from "openai";
import { makeAudio } from "./src/audio";
import fs from "fs";

import {
  systemPromptGameStart,
  currentGameState,
  story,
  shortHistory,
  behaviour,
  storyline,
  advanceStoryDefinition,
} from "./src/stories/cypher";

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

const now = new Date();
const startupTimestamp = now
  .toISOString()
  .replace(/:/g, "-")
  .replace(/\..+/, "");

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

interface Message {
  role: string;
  content: string;
  tool_calls?: any[];
}

interface LogMessage {
  input: string;
  response: string;
  filename?: string;
}

const logMessages: Message[] = [];

function cleanMessages(messages: Message[]): Message[] {
  return messages.map((message) => {
    if (!message?.content) return message;

    const promptIndex = message.content.indexOf("Story context:");
    if (promptIndex !== -1) {
      return {
        ...message,
        content: message.content.slice(0, promptIndex).trim(),
      };
    }
    // console.log("promptIndex", promptIndex);
    return message;
  });
}

function cleanFunctionMessages(messages: Message[]): Message[] {
  return messages.map((message) => {
    if (!message?.tool_calls) return message;
    console.log("mess", message?.tool_calls);
    let toolStrings = message.tool_calls.map((tool) => {
      return `${tool.type} : ${tool?.function?.name} : ${Object.entries(
        JSON.parse(tool?.function?.arguments)
      ).join(": ")}`;
    });
    delete message?.tool_calls;
    message.content = `${message.content} ${toolStrings.join("\n")}`;
    return message;
  });
}

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

let stateItems: Record<string, string> = {};
function updateGameState(property: string, value: string) {
  stateItems[property] = value;
  console.log(chalk.cyan("UPDATING GAME STATE"), property, value);
  // console.log("stateItems", stateItems);
}

let situations = [];
function continueGame(situation) {
  situations.push(situation);
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

let messages: Message[] = [
  {
    role: "system",
    content: `
    ${systemPromptGameStart}\n\n
    ${currentGameState}
    The story: ${story}\n\n
    Your behaviour: ${behaviour}\n\n
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
      description: advanceStoryDefinition,
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
        "characters we meet in game can be recruited to join our party of comrades and friends. we can pay them a fee to join us. If they agree, to join us they can. But they must agree. We can pay if they negotiate.",
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

  messages = cleanMessages(messages);
  // messages = cleanFunctionMessages(messages);

  messages.push({
    role: "user",
    content: `user says: ${prompt}
    Story context:
    This chapter: ${storyline.sections[currentChapter].gptPrompt}
    Objectives: ${storyline.sections[currentChapter].objectives.join(", ")}
    Comrades: ${comrades.join(", ")}
    Characters Met: ${metCharacters
      .map((char) => `${char.name}, ${char.role}, met at ${char.meetingPlace}`)
      .join("\n")}
    Inventory Items: ${Object.entries(stateItems).join(", ")}
    MAX 60 words reply, try to keep to snappy dialogue. Only exception is for creative world building. Suck me in to the story.
    ${
      storyline.sections[currentChapter]?.puzzle
        ? `Weave the puzzle into the story: ${storyline.sections[currentChapter].puzzle}`
        : ""
    }`,
  });

  // messages.push({
  //   role: "user",
  //   content: `user says: ${prompt} \n\n

  //   Story context:
  //   \n
  //   Prompt for this chapter: ${
  //     storyline.sections[currentChapter].gptPrompt
  //   } \n\n Objectives: ${storyline.sections[currentChapter].objectives.join(
  //     "\n"
  //   )} \n\n Comrades: ${comrades.join(
  //     ", "
  //   )} \n\n Characters Met: ${metCharacters
  //     .map((char) => `${char.name}, ${char.role}, met at ${char.meetingPlace}`)
  //     .join("\n")} \n\n Inventory Items: ${Object.entries(stateItems).join(
  //     ", "
  //   )} \n\n MAX 40 words reply.   ${
  //     storyline.sections[currentChapter]?.puzzle
  //       ? `Not straight away, but as part of the narrative, introduce the puzzle: ${storyline.sections[currentChapter].puzzle}`
  //       : ""
  //   }`,
  // });

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
        content: functionResponse || "OK", // default value
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

async function promptUser() {
  rl.question(" > ", (input) => {
    runConversation(input)
      // Replace the existing code block with this
      .then(async (result) => {
        const response = result?.[0]?.message?.content;
        console.log(chalk.green(response));
        let filename;
        if (response) {
          filename = await makeAudio(response, openai);
        }
        console.log(
          chalk.gray(
            `Chapter ${currentChapter + 1}/${storyline.sections.length}:`
          ),
          chalk.yellow(storyline.sections[currentChapter].title)
        );

        // console.log(
        //   chalk.blue("input"),
        //   input,
        //   chalk.blue("response"),
        //   response,
        //   chalk.blue("filename"),
        //   filename
        // );

        // Add the message to the array
        logMessages.push({ input, response, filename });

        // Write the data to a file
        const data = JSON.stringify(logMessages);

        fs.writeFile(
          `./logs/conversation-log-${startupTimestamp}.json`,
          data,
          (err) => {
            if (err) throw err;
          }
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
