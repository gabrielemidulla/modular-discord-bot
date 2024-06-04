import { Loader } from "../base/Loader";
import path from "node:path";
import { Logger } from "../utils/Logger";
import { Color } from "../utils/Color";
import { CustomClient } from "../utils/CustomClient";
import { Module } from "base/Module";
import { ClassImporter } from "utils/ClassImporter";
import { Event } from "base/Event";

export class EventLoader extends Loader {
    constructor(module: Module, folderPath: string) {
        super(module, folderPath);
    }

    async load(): Promise<void> {
        Logger.log(`Loading events from ${Color.Bright}${this.module.name} v${this.module.version}${Color.Reset}...`);
        const folderPath = path.join(this.folderPath, "events");

        await new ClassImporter<Event<any>>(folderPath, async (event: Event<any>, file: string) => {
            if (event.once) {
                CustomClient.getInstance().once(event.name, (...args) => event.execute(...args));
            } else {
                CustomClient.getInstance().on(event.name, (...args) => event.execute(...args));
            }
            Logger.success(`Loaded event ${Color.Bright}${event.name}${Color.Reset} ${Color.FgGreen}(${file})${Color.Reset}`);
        }).load();


        Logger.success(`All events loaded from ${Color.Bright}${this.module.name} v${this.module.version}${Color.Reset}`);
    }
}
