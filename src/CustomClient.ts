import { Client, ClientOptions, Collection } from "discord.js";
import { Command } from "./base/Command";
import { Logger } from "utils/Logger";

export class CustomClient extends Client {
    private static instance: CustomClient;
    commands: Collection<string, Command>;

    private constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection<string, Command>();
    }

    public static getInstance(options?: ClientOptions): CustomClient {

        if (!CustomClient.instance && options) {
            Logger.log("Creating CustomClient instance...");
            try {
                CustomClient.instance = new CustomClient(options);
                Logger.success("CustomClient instance created");
            } catch (e) {
                Logger.error("Failed to create CustomClient instance", e);
            }
        }
        return CustomClient.instance;
    }
}
