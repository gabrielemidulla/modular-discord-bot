import { Loader } from "./base/Loader";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "url";
import { Logger } from "./utils/Logger";
import { Color } from "./utils/Color";
import { CustomClient } from "./CustomClient";
import { Module } from "base/Module";

export class EventLoader extends Loader {
    constructor(module: Module, folderPath: string) {
        super(module, folderPath);
    }

    async load(): Promise<void> {
        Logger.log(`Loading events from ${Color.Bright}${this.module.name} v${this.module.version}${Color.Reset}...`);
        const eventFolderPath = path.join(this.folderPath, "events");
        const eventFiles = fs.existsSync(eventFolderPath) ? fs.readdirSync(eventFolderPath) : [];

        for (const file of eventFiles) {
            const filePath = path.join(eventFolderPath, file);
            try {
                const { default: EventClass } = await import(pathToFileURL(filePath).href);

                if (!EventClass) continue;

                const event = new EventClass();

                if (event.once) {
                    CustomClient.getInstance().once(event.name, (...args) => event.execute(...args));
                } else {
                    CustomClient.getInstance().on(event.name, (...args) => event.execute(...args));
                }
                Logger.success(`Loaded event ${Color.Bright}${event.name}${Color.Reset} ${Color.FgGreen}(${file})${Color.Reset}`);
            } catch (error) {
                Logger.error(`Failed to load event at ${Color.Bright}${filePath}${Color.Reset}:`, error);
            }
        }
        Logger.success(`All events loaded from ${Color.Bright}${this.module.name} v${this.module.version}${Color.Reset}`);
    }
}
