import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "url";
import { Logger } from "./Logger";
import { Color } from "./Color";

export class FileImporter<T> {
    public func: (item: T, file: string) => Promise<void>;
    public folderPath: string;
    constructor(folderPath: string, func: (item: T, file: string) => Promise<void>) {
        this.folderPath = folderPath;
        this.func = func;
    }

    async load(): Promise<void> {
        const files = fs.existsSync(this.folderPath) ? fs.readdirSync(this.folderPath) : [];

        for (const file of files) {
            const filePath = path.join(this.folderPath, file);
            try {
                const { default: DefaultClass } = await import(pathToFileURL(filePath).href);

                if (!DefaultClass) continue;

                const item = new DefaultClass();
                await this.func(item, file);
            } catch (error) {
                Logger.error(`Failed to load content at ${Color.Bright}${filePath}${Color.Reset}:`, error);
            }
        }
    }
}
