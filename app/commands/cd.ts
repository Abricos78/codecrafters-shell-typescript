import type { Interface } from "readline";


export const cd = (function() {
    const HOME = process.env.HOME!

    return (rl: Interface, directory: string) => {
        try {
            if (directory === '~') {
                process.chdir(HOME)
            } else {
                process.chdir(directory)
            }
        } catch(e) {
            rl.write(`cd: ${directory}: No such file or directory\n`)
        }
    }

})()
