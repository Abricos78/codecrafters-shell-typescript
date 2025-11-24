import { createInterface } from "readline";
import { cd, COMMANDS, type as commandType, echo, pwd } from "./commands";
import { checkCommandPath, getFirstWordAndRest, prepareArgs } from "./lib";
import { execFileSync } from "child_process";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const startPrompt = '$ '

const callbackQuestion = (answer: string) => {
  const [command, unprepareArgs] = getFirstWordAndRest(answer)
  const arrArgs = prepareArgs(unprepareArgs?.trim())
  const str = arrArgs.join(' ')

  switch (command) {
    case COMMANDS.EXIT:
      rl.close()
      return
    case COMMANDS.ECHO:
      echo(rl, str)
      break
    case COMMANDS.TYPE:
      commandType(rl, str)
      break
    case COMMANDS.PWD:
      pwd(rl)
      break
    case COMMANDS.CD:
      cd(rl, str)
      break
    default:
      const fullPath = checkCommandPath(command)

      if (fullPath) {
        const res = execFileSync(command, arrArgs)
        rl.write(`${res}`)
      } else {
        rl.write(`${answer}: command not found\n`)
      }
  }

  rl.question(startPrompt, callbackQuestion)
}


rl.question(startPrompt, callbackQuestion);
