import type { Interface } from "readline";
import { checkCommandPath, getFirstWordAndRest } from "../lib";
import { COMMANDS } from "./enums";

export async function type(rl: Interface, args: string) {
    const [command] = getFirstWordAndRest(args)

    switch (command) {
        case COMMANDS.ECHO:
        case COMMANDS.EXIT:
        case COMMANDS.TYPE:
            rl.write(`${command} is a shell builtin\n`)
            break;
        default:
            const fullPath = checkCommandPath(command)

            if (fullPath) {
                rl.write(`${command} is ${fullPath}\n`)
            } else {
                rl.write(`${command}: not found\n`)
            }
    
    }
}
