export function getFirstWordAndRest(str: string) {
    const result = []
    if (str.startsWith('\'') || str.startsWith('"')) {
        let command = ''
        let quoeStack = [str[0]]

        for (let i = 1; i < str.length; i++) {
            if (str[i] === quoeStack[0]) {
                result.push(command)
                result.push(...str.substring(i + 1).split(/(?<=^\S+)\s/)!)
                return result
            }
            command += str[i]
        }

        return [command, '']

    } else {
        return str.split(/(?<=^\S+)\s/)
    }
}
