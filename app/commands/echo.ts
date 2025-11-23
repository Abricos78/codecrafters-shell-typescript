import type { Interface } from "readline";

export function echo(rl: Interface, args: string) {
    rl.write(`${args}\n`)
}
