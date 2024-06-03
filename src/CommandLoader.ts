import { Loader } from "./base/Loader";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "url";
import { Logger } from "./utils/Logger";
import { Color } from "./utils/Color";
import { CustomClient } from "./CustomClient";

export class CommandLoader extends Loader {
    constructor() {
        super();
    }

    async load(): Promise<void> {
        const foldersPath = path.join(this.__dirname, 'commands');
        const commandFolders = fs.existsSync(foldersPath) ? fs.readdirSync(foldersPath) : [];

        for (const folder of commandFolders) {

            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                try {
                    const { default: CommandClass } = await import(pathToFileURL(filePath).href);

                    if (!CommandClass) continue;

                    const command = new CommandClass();

                    if ('data' in command && 'execute' in command) {
                        CustomClient.getInstance().commands.set(command.data.name, command);
                        Logger.success(`Loaded command ${Color.Bright}${command.data.name}${Color.Reset} ${Color.FgGreen}(${folder})${Color.Reset}`);
                    } else {
                        Logger.warn(`The command at ${Color.Bright}${filePath}${Color.Reset} is missing a required "data" or "execute" property.`)
                    }
                } catch (error) {
                    Logger.error(`Failed to load command at ${Color.Bright}${filePath}${Color.Reset}:`, error);
                }
            }
        }
    }
}