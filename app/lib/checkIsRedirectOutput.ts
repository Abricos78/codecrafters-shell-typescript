export function checkRedirectOutput(args: string[]): [string, string[]] {
    const redirectIndex = args.findIndex((elem) => {
        switch (elem) {
            case '>':
            case '1>':
                return true
            default:
                return false
        }
    })

    if (redirectIndex === -1) return ['', args]

    const redirectOutputPath = args[redirectIndex + 1]

    return [redirectOutputPath, args.slice(0, redirectIndex)]
}
