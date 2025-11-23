export function getFirstWordAndRest(str: string) {
    return str.split(/(?<=^\S+)\s/)
}
