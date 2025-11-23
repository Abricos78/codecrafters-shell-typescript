import path from "path";
import type { Interface } from "readline";

export function pwd(rl: Interface) {
    rl.write(`${path.join(__dirname, '../..')}\n`)
}
