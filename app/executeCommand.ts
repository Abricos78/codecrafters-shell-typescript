import type { Interface } from "readline";
import { COMMANDS, echo, type as commandType, pwd, cd } from "./commands";
import { checkCommandPath } from "./lib";
import { execFile } from "child_process";
import { promisify } from 'util'

const execFilePromisify = promisify(execFile)

export async function executeCommand(
  rl: Interface,
  command: string,
  answer: string,
  arrArgs: string[],
) {
  const str = arrArgs.join(" ");

  switch (command) {
    case COMMANDS.EXIT:
      rl.close();
      return;
    case COMMANDS.ECHO:
      return echo(str);
    case COMMANDS.TYPE:
      return commandType(str);
    case COMMANDS.PWD:
      return pwd();
    case COMMANDS.CD:
      return cd(str);
    default:
      const fullPath = checkCommandPath(command);

      if (fullPath) {
        const { stdout, stderr } = await execFilePromisify(command, arrArgs)
        
          return `${stdout}`
      } else {
        return `${answer}: command not found\n`
      }
  }
}
