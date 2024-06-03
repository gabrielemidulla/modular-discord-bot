import { Client, ClientOptions, Collection } from "discord.js";
import { Command } from "./base/Command";

export class CustomClient extends Client {
    private static instance: CustomClient;
    commands: Collection<string, Command>;

    private constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection<string, Command>();
    }

    public static getInstance(options?: ClientOptions): CustomClient {
        if (!CustomClient.instance && options) {
            CustomClient.instance = new CustomClient(options);
        }
        return CustomClient.instance;
    }
}
