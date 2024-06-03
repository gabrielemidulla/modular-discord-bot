import { Loader } from "./base/Loader";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "url";
import { Logger } from "./utils/Logger";
import { Color } from "./utils/Color";
import { CustomClient } from "./CustomClient";

export class EventLoader extends Loader {
    constructor() {
        super();
    }

    async load(): Promise<void> {
        const foldersPath = path.join(this.__dirname, 'events');
        const eventFolders = fs.existsSync(foldersPath) ? fs.readdirSync(foldersPath) : [];

        for (const folder of eventFolders) {
            const eventsPath = path.join(foldersPath, folder);
            const eventFiles = fs.existsSync(eventsPath) ? fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts')) : [];

            for (const file of eventFiles) {
                const filePath = path.join(eventsPath, file);
                try {
                    const { default: EventClass } = await import(pathToFileURL(filePath).href);

                    if (!EventClass) continue;

                    const event = new EventClass();

                    if (event.once) {
                        CustomClient.getInstance().once(event.name, (...args) => event.execute(...args));
                    } else {
                        CustomClient.getInstance().on(event.name, (...args) => event.execute(...args));
                    }
                    Logger.success(`Loaded event ${Color.Bright}${event.name}${Color.Reset} ${Color.FgGreen}(${folder})${Color.Reset}`);
                } catch (error) {
                    Logger.error(`Failed to load event at ${Color.Bright}${filePath}${Color.Reset}:`, error);
                }
            }
        }
    }
}