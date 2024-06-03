import { Loader } from "./base/Loader";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "url";
import { Logger } from "./utils/Logger";
import { Color } from "./utils/Color";
import { CustomClient } from "./CustomClient";
import { Module } from "base/Module";

export class CommandLoader extends Loader {
    constructor(module: Module, folderPath: string) {
        super(module, folderPath);
    }

    async load(): Promise<void> {
        Logger.log(`Loading commands from ${Color.Bright}${this.module.name} v${this.module.version}${Color.Reset}...`);
        const commandsFolderPath = path.join(this.folderPath, "commands");
        const commandFiles = fs.existsSync(commandsFolderPath) ? fs.readdirSync(commandsFolderPath) : [];

        for (const file of commandFiles) {
            const filePath = path.join(commandsFolderPath, file);
            try {
                const { default: CommandClass } = await import(pathToFileURL(filePath).href);

                if (!CommandClass) continue;

                const command = new CommandClass();

                if ('data' in command && 'execute' in command) {
                    CustomClient.getInstance().commands.set(command.data.name, command);
                    Logger.success(`Loaded command ${Color.Bright}${command.data.name}${Color.Reset} ${Color.FgGreen}(${file})${Color.Reset}`);
                } else {
                    Logger.warn(`The command at ${Color.Bright}${filePath}${Color.Reset} is missing a required "data" or "execute" property.`)
                }
            } catch (error) {
                Logger.error(`Failed to load command at ${Color.Bright}${filePath}${Color.Reset}:`, error);
            }
        }
        Logger.success(`All commands loaded from ${Color.Bright}${this.module.name} v${this.module.version}${Color.Reset}`);
    }
}
