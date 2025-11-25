export function prepareArgs(args?: string) {
    if (!args) return []

    const doubleQuotesStack = []
    const singleQuotesStack = []
    const result = []

    let str = ''

    firstCycle: for (let i = 0; i < args.length; i++) {
        const char = args[i]

        if (char === '\\') {
            const specialExpression = `${char}${args[++i] || ''}`
            const lastChar = specialExpression.at(-1)!

            switch (specialExpression) {
                case '\\"':
                    if (singleQuotesStack.length) str += specialExpression
                    else str += lastChar
                    continue firstCycle
                case '\\\'':
                    if (singleQuotesStack.length || doubleQuotesStack.length) str += specialExpression
                    else str += lastChar
                    continue firstCycle
                case '\\n':
                case '\\$':
                case '\\`':
                    if (singleQuotesStack.length || doubleQuotesStack.length) str += specialExpression
                    else str += lastChar
                    continue firstCycle
                case '\\\\':
                    str += lastChar
                    continue firstCycle
                case '\\ ':
                    str += ' '
                    continue firstCycle
                default:
                    str += specialExpression
                    continue firstCycle
            }
        }

        if (char === '\"') {
            if (!doubleQuotesStack.length) {
                doubleQuotesStack.push(char)
            } else {
                doubleQuotesStack.pop()
                singleQuotesStack.length = 0
            }
            continue
        }

        if (char === '\'') {
            if (!singleQuotesStack.length) {
                singleQuotesStack.push(char)
            } else {
                singleQuotesStack.pop()
            }
            if (!doubleQuotesStack.length) continue
        }

        if (doubleQuotesStack.length || singleQuotesStack.length) {
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
