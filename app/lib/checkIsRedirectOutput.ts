export function checkRedirectOutput(args: string[]) {
    const redirectIndex = args.findIndex((elem) => {
        switch (elem) {
            case '>':
            case '1>':
                return true
            default:
                return false
        }
    })

    if (redirectIndex === -1) return ''

    return args[redirectIndex + 1]
}
