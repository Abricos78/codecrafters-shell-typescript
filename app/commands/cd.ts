import type { Interface } from "readline";


export function cd(rl: Interface, directory: string) {
    try {
        process.chdir(directory)
    } catch(e) {
        rl.write(`cd: ${directory}: No such file or directory\n`)
    }
}
