import * as readline from "readline";

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

console.log("Welcome to the infinite story!");
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

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

function makeChoice(choice, options) {
  console.log("MAKING CHOICE. Out of", options, choice);
}

function savePreference(preference, sentiment) {
  console.log("SAVING PREFERENCE", preference, sentiment);
}

function solveQuery() {
  console.log("SOLVED!!!!! THE MYSTERY IS SOLVED!!!!");
}

function updateGameState(property, value) {
  console.log("UPDATING GAME STATE", property, value);
}

function continueGame(situation) {
  console.log("CONTINUING, situation report:", situation);
}

function advanceStory(situation) {
  currentStory = story2;
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
  {
    type: "function",
    function: {
      name: "get_current_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_latitude",
      description: "Get the latitude of a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
        },
        required: ["location"],
      },
    },
  },
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
      description: "the player asked to continue to part 2",
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
];

export async function runConversation(prompt: string) {
  // Step 1: send the conversation and available functions to the model
  messages.push({
    role: "user",
    content: prompt,
  });

  const response = await openai.chat.completions.create({
    // model: "gpt-3.5-turbo-1106",
    model: "gpt-4-1106-preview",
    messages: messages,
    tools: tools,
    tool_choice: "auto", // auto is default, but we'll be explicit
    // response_format: { type: "json_object" },
  });
  const responseMessage = response.choices[0].message;

  // Step 2: check if the model wanted to call a function
  const toolCalls = responseMessage.tool_calls;
  if (responseMessage.tool_calls) {
    // Step 3: call the function
    // Note: the JSON response may not always be valid; be sure to handle errors

    const availableFunctions = {
      get_current_weather: getCurrentWeather,
      get_latitude: getLatitude,
      make_choice: makeChoice,
      save_preference: savePreference,
      solve_query: solveQuery,
      update_game_state: updateGameState,
      continue: continueGame,
      advance_story: advanceStory,
    }; // two functions in this example, but you can have multiple

    messages.push(responseMessage); // extend conversation with assistant's reply

    console.log(responseMessage);

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
  }

  // If no function was called, return the initial response
  return response.choices;
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
  rl.question("Please enter your input: ", (input) => {
    runConversation(input)
      .then((result) => {
        console.log(result?.[0]?.message?.content);
        if (result?.[0]?.message?.content) {
          makeAudio(result[0].message.content, openai);
        }
        promptUser(); // prompt for the next input
      })
      .catch((error) => {
        console.error(error);
        promptUser(); // continue the conversation despite the error
      });
  });
}

promptUser(); // start the conversation
