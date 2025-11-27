import { checkCommandPath, getFirstWordAndRest } from "../lib";
import { COMMANDS } from "./enums";

export function type(args: string) {
    const [command] = getFirstWordAndRest(args)

    switch (command) {
        case COMMANDS.ECHO:
        case COMMANDS.EXIT:
        case COMMANDS.TYPE:
        case COMMANDS.PWD:
        case COMMANDS.CD:
            return `${command} is a shell builtin\n`
        default:
            const fullPath = checkCommandPath(command)

            if (fullPath) return `${command} is ${fullPath}\n`

            return `${command}: not found\n`
    }
}
