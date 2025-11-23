import { createInterface } from "readline";
import { cd, COMMANDS, type as commandType, echo, pwd } from "./commands";
import { checkCommandPath, getFirstWordAndRest } from "./lib";
import { execFileSync, spawnSync } from "child_process";

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
    case COMMANDS.PWD:
      pwd(rl)
      break
    case COMMANDS.CD:
      cd(rl, args)
      break
    default:
      const fullPath = checkCommandPath(command)

      if (fullPath) {
        const res = execFileSync(command, args.split(' '))
        rl.write(`${res}`)
      } else {
        rl.write(`${answer}: command not found\n`)
      }
  }

  rl.question(startPrompt, callbackQuestion)
}


rl.question(startPrompt, callbackQuestion);
