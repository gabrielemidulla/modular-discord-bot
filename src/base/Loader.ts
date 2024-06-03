import { fileURLToPath } from 'url';
import path from "node:path";

export class Loader {
    __filename: string;
    __dirname: string;

    constructor() {
        this.__filename = fileURLToPath(import.meta.url);
        this.__dirname = path.resolve(path.dirname(this.__filename), '..');
    }
    async load() { }
}
