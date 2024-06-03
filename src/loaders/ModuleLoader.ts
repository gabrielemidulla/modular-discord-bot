import { Loader } from "../base/Loader";
import fs from "node:fs";
import path from "node:path";
import { Logger } from "../utils/Logger";
import { Color } from "../utils/Color";
import { CommandLoader } from "loaders/CommandLoader";
import { EventLoader } from "loaders/EventLoader";
import { FileImporter } from "utils/FileImporter";
import { Module } from "base/Module";

export class ModuleLoader extends Loader {
    constructor(folderPath: string) {
        super(undefined, folderPath);
    }

    async load(): Promise<void> {
        Logger.log(`Loading modules from ${Color.Bright}${this.folderPath}${Color.Reset}...`);
        const foldersPath = path.join(this.__dirname, this.folderPath);
        const moduleFolders = fs.existsSync(foldersPath) ? fs.readdirSync(foldersPath) : [];


        for (const folder of moduleFolders) {
            const modulePath = path.join(foldersPath, folder);
            await new FileImporter<Module>(foldersPath, async (module: Module, folder: string) => {
                const commandLoader = new CommandLoader(module, modulePath);
                const eventLoader = new EventLoader(module, modulePath);

                await commandLoader.load();

                await eventLoader.load();

                Logger.success(`Loaded module ${Color.Bright}${module.name}${Color.Reset} ${Color.FgGreen}(${folder})${Color.Reset}`);
            }).load();
        }
        Logger.success(`All modules loaded`);
    }
}