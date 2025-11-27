import { createInterface } from "readline";
import { checkRedirectOutput, getFirstWordAndRest, prepareArgs } from "./lib";
import { executeCommand } from "./executeCommand";
import { writeFileSync } from 'fs'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const startPrompt = '$ '

const callbackQuestion = (answer: string) => {
  const [command, unprepareArgs] = getFirstWordAndRest(answer)
  const arrArgs = prepareArgs(unprepareArgs?.trim())
  const redirectOutput = checkRedirectOutput(arrArgs)

  const output = executeCommand(rl, command, answer, arrArgs)

  if (output) {
    if (redirectOutput) {
      writeFileSync(redirectOutput, output)
    } else {
      rl.write(output)
    }
  }

  rl.question(startPrompt, callbackQuestion)
}


rl.question(startPrompt, callbackQuestion);
