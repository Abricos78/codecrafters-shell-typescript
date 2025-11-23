import { accessSync, constants } from 'fs';
import path from 'path'

export function checkCommandPath(command: string) {
    const paths = process.env.PATH?.split(path.delimiter)!

    const fullPath = paths.find((item) => {
        const fullPath = path.join(item, command)
    
        try {
            accessSync(fullPath, constants.F_OK);
            accessSync(fullPath, constants.X_OK);
    
            return true
        } catch (e) {
            return false
        }
    })

    return fullPath ? path.join(fullPath, command) : null
}
