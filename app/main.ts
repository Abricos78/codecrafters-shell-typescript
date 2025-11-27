import { createInterface } from "readline";
import { checkRedirectOutput, getFirstWordAndRest, prepareArgs } from "./lib";
import { executeCommand } from "./executeCommand";
import { openSync, existsSync, writeFileSync } from 'fs'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const startPrompt = '$ '

const callbackQuestion = async (answer: string) => {
  const [command, unprepareArgs] = getFirstWordAndRest(answer)
  const arrArgs = prepareArgs(unprepareArgs?.trim())
  const [redirectOutputPath, newArgs] = checkRedirectOutput(arrArgs)

  const output = await executeCommand(rl, command, answer, newArgs)
    
  if (output) {
    if (redirectOutputPath) {
      writeFileSync(redirectOutputPath, output)
    } else {
      rl.write(output)
    }
  }
  
  rl.question(startPrompt, callbackQuestion)
}


rl.question(startPrompt, callbackQuestion);
