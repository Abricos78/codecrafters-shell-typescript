import { createInterface } from "readline";
import { COMMANDS } from "./commandsEnum";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const startPrompt = '$ '

const callbackQuestion = (answer: string) => {

  if (answer.startsWith(COMMANDS.EXIT)) {
      rl.close()
      return
  }

  if (answer.startsWith(COMMANDS.ECHO)) {
    rl.write(`${answer.substring(COMMANDS.ECHO.length + 1)}\n`)
  } else {
    rl.write(`${answer}: command not found \n`)
  }

  rl.question(startPrompt, callbackQuestion)
}


rl.question(startPrompt, callbackQuestion);
