import { createInterface } from "readline";
import { COMMANDS, type as commandType, echo } from "./commands";
import { getFirstWordAndRest } from "./lib";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const startPrompt = '$ '

const callbackQuestion = (answer: string) => {
  const [command, args] = getFirstWordAndRest(answer)

  switch (command) {
    case COMMANDS.EXIT:
      rl.close()
      return
    case COMMANDS.ECHO:
      echo(rl, args)
      break
    case COMMANDS.TYPE:
      commandType(rl, args)
      break
    default:
      rl.write(`${answer}: command not found\n`)
  }

  rl.question(startPrompt, callbackQuestion)
}


rl.question(startPrompt, callbackQuestion);
