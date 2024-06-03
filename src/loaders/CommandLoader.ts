import { Loader } from "../base/Loader";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "url";
import { Logger } from "../utils/Logger";
import { Color } from "../utils/Color";
import { CustomClient } from "../utils/CustomClient";
import { Module } from "base/Module";
import { FileImporter } from "utils/FileImporter";
import { Command } from "base/Command";

export class CommandLoader extends Loader {
    constructor(module: Module, folderPath: string) {
        super(module, folderPath);
    }

    async load(): Promise<void> {
        Logger.log(`Loading commands from ${Color.Bright}${this.module.name} v${this.module.version}${Color.Reset}...`);
        const folderPath = path.join(this.folderPath, "commands");

        await new FileImporter<Command>(folderPath, async (command: Command, file: string) => {
            const filePath = path.join(this.folderPath, file);
            if ('data' in command && 'execute' in command) {
                CustomClient.getInstance().commands.set(command.data.name, command);
                Logger.success(`Loaded command ${Color.Bright}${command.data.name}${Color.Reset} ${Color.FgGreen}(${file})${Color.Reset}`);
            } else {
                Logger.warn(`The command at ${Color.Bright}${filePath}${Color.Reset} is missing a required "data" or "execute" property.`)
            }
        }).load();

        Logger.success(`All commands loaded from ${Color.Bright}${this.module.name} v${this.module.version}${Color.Reset}`);
    }
}
