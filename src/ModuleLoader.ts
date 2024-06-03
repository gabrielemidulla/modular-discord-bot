import { Loader } from "./base/Loader";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "url";
import { Logger } from "./utils/Logger";
import { Color } from "./utils/Color";
import { CommandLoader } from "CommandLoader";
import { EventLoader } from "EventLoader";

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
            const moduleFiles = fs.existsSync(modulePath) ? fs.readdirSync(modulePath).filter(file => file.endsWith('.ts')) : [];

            for (const file of moduleFiles) {
                const filePath = path.join(modulePath, file);
                try {
                    const { default: ModuleClass } = await import(pathToFileURL(filePath).href);

                    if (!ModuleClass) continue;

                    const module = new ModuleClass();

                    const commandLoader = new CommandLoader(module, modulePath);
                    const eventLoader = new EventLoader(module, modulePath);

                    await commandLoader.load();

                    await eventLoader.load();

                    Logger.success(`Loaded module ${Color.Bright}${module.name}${Color.Reset} ${Color.FgGreen}(${folder})${Color.Reset}`);
                } catch (error) {
                    Logger.error(`Failed to load module at ${Color.Bright}${filePath}${Color.Reset}:`, error);
                }
            }
        }
        Logger.success(`All modules loaded`);
    }
}