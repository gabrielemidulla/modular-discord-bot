import { fileURLToPath } from 'url';
import path from "node:path";
import { Module } from './Module';

export class Loader {
    __filename: string;
    __dirname: string;
    public folderPath: string;
    public module: Module;

    constructor(module: Module, folderPath: string) {
        this.folderPath = folderPath;
        this.module = module;
        this.__filename = fileURLToPath(import.meta.url);
        this.__dirname = path.resolve(path.dirname(this.__filename), '..');
    }
    async load() { }
}
