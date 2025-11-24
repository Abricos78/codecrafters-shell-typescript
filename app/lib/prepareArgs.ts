export function prepareArgs(args?: string) {
    if (!args) return []

    const singleQuotesStack = []
    const result = []

    let str = ''

    for (let i = 0; i < args.length; i++) {
        const char = args[i]

        if (char === '\'') {
            if (!singleQuotesStack.length) {
                singleQuotesStack.push(char)
            } else {
                singleQuotesStack.pop()
            }
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
