import { Loader } from "../base/Loader";
import fs from "node:fs";
import path from "node:path";
import { Logger } from "../utils/Logger";
import { Color } from "../utils/Color";
import { CommandLoader } from "loaders/CommandLoader";
import { EventLoader } from "loaders/EventLoader";
import { Module } from "base/Module";
import { MySQLConnector } from "database/MySQLConnector";
import { ClassImporter } from "utils/ClassImporter";

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

            await new ClassImporter<Module>(modulePath, async (module: Module, moduleFile: string) => {

                await this.executeSchemas(modulePath, moduleFile, module, folder);

                const commandLoader = new CommandLoader(module, modulePath);
                const eventLoader = new EventLoader(module, modulePath);

                await commandLoader.load();

                await eventLoader.load();

                Logger.success(`Loaded module ${Color.Bright}${module.name}${Color.Reset} ${Color.FgGreen}(${folder})${Color.Reset}`);
            }).load(".ts");
        }
        Logger.success(`All modules loaded`);
    }

    private async executeSchemas(modulePath: string, moduleFile: string, module: Module, folder: string) {
        const schemaFiles = fs.existsSync(modulePath) ? fs.readdirSync(modulePath).filter(x => x.endsWith(".sql")) : [];
        for (const file of schemaFiles) {
            const filePath = path.join(modulePath, file);

            const queries = fs.readFileSync(filePath).toString().split(";").filter(x => x.trim().length > 0);
            const connector: MySQLConnector = await MySQLConnector.getInstance();
            try {
                Logger.log(`Executing schema queries ${Color.Bright}${file}${Color.Reset} (${folder})...`);

                const tableQuery = "CREATE TABLE IF NOT EXISTS " + folder + "_settings (`key` varchar(512) PRIMARY KEY, `value` varchar(512) DEFAULT NULL);"
                queries.push(tableQuery);

                for (const key of Object.keys(module.settings)) {
                    const settingQuery = "INSERT INTO " + folder + "_settings (`key`, `value`) VALUES(\"" + key + "\", \"" + module.settings[key] + "\") ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);";
                    queries.push(settingQuery);
                }

                for (const query of queries) {
                    await connector.connection.query(query);
                }

                Logger.success(`Schema queries executed ${Color.Bright}${file}${Color.Reset} (${folder})`);
            } catch (e) {
                Logger.error(`Failed to execute schema queries ${Color.Bright}${file}${Color.Reset} (${moduleFile})`, e);
            }
        }
    }
}