export function prepareArgs(args?: string) {
    if (!args) return []

    const doubleQuotesStack = []
    const singleQuotesStack = []
    const result = []

    let str = ''

    for (let i = 0; i < args.length; i++) {
        const char = args[i]

        if (char === '\"') {
            if (!doubleQuotesStack.length) {
                doubleQuotesStack.push(char)
            } else {
                doubleQuotesStack.pop()
            }
            continue
        }

        if (char === '\'' && !doubleQuotesStack.length) {
            if (!singleQuotesStack.length) {
                singleQuotesStack.push(char)
            } else {
                singleQuotesStack.pop()
            }
            continue
        }

        if (doubleQuotesStack.length) {
            str += char
            continue
        }

        if (singleQuotesStack.length) {
            str += char
            continue
        }

        if (char === ' ') {
            if (str) {
                result.push(str)
                str = ''
            }
            continue
        }

        str += char
    }

    result.push(str)

    return result
}
