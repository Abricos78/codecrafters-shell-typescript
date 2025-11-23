import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const startPrompt = '$ '

const callbackQuestion = (answer: string) => {
  rl.write(`${answer}: command not found \n`)
  rl.question(startPrompt, callbackQuestion)
}


rl.question(startPrompt, callbackQuestion);
