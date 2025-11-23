import type { Interface } from "readline";
import { getFirstWordAndRest } from "../lib";
import { COMMANDS } from "./enums";

export function type(rl: Interface, args: string) {
    const [command] = getFirstWordAndRest(args)

    switch (command) {
        case COMMANDS.ECHO:
        case COMMANDS.EXIT:
        case COMMANDS.TYPE:
            rl.write(`${command} is a shell builtin\n`)
            break;
        default:
            rl.write(`${args}: not found\n`)
    }
}
