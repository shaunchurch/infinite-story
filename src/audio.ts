import { exec } from "child_process";
import path from "path";
import fs from "fs";

export async function makeAudio(prompt: string, openai: any) {
  const now = new Date();
  const dateString = now.toISOString().replace(/:/g, "-");
  const speechFile = path.resolve(`./speech-${dateString}.mp3`);

  const mp3 = await openai.audio.speech.create({
    model: "tts-1-hd",
    voice: "fable",
    input: prompt,
  });

  // console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);

  exec(`afplay ${speechFile}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stdout) {
      console.log(`stdout: ${stdout}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
  });
}
