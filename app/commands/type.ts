import type { Interface } from "readline";
import { getFirstWordAndRest } from "../lib";
import { COMMANDS } from "./enums";
import { accessSync, constants } from 'fs'
import path from "path";

export async function type(rl: Interface, args: string) {
    const [command] = getFirstWordAndRest(args)

    switch (command) {
        case COMMANDS.ECHO:
        case COMMANDS.EXIT:
        case COMMANDS.TYPE:
            rl.write(`${command} is a shell builtin\n`)
            break;
        default:
            const paths = process.env.PATH?.split(path.delimiter)!

            const fullPath = paths.find((item) => {
                const fullPath = path.join(item, command)

                try {
                    accessSync(fullPath, constants.F_OK);
                    accessSync(fullPath, constants.X_OK);

                    return true
                } catch (e) {
                    return false
                }
            })

            if (fullPath) {
                rl.write(`${command} is ${path.join(fullPath, command)}\n`)
            } else {
                rl.write(`${command}: not found\n`)
            }
    
    }
}
