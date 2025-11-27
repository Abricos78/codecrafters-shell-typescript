export const cd = (function() {
    const HOME = process.env.HOME!

    return (directory: string) => {
        try {
            if (directory === '~') {
                process.chdir(HOME)
            } else {
                process.chdir(directory)
            }
        } catch(e) {
            return `cd: ${directory}: No such file or directory\n`
        }
    }

})()
