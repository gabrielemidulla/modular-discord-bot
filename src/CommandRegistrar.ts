import { REST, Routes } from "discord.js";
import { Logger } from "./utils/Logger";
import { CustomClient } from "./CustomClient";
import { Color } from "./utils/Color";

export class CommandRegistrar {
    async register() {
        if (!process.env.DISCORD_TOKEN) throw new Error("No Discord token was provided. Please provide a token in the .env file.");
        const rest = new REST();
        rest.setToken(process.env.DISCORD_TOKEN);

        try {
            Logger.success(`Started refreshing ${Color.Bright}${CustomClient.getInstance().commands.size}${Color.Reset} application (/) commands.`);

            const commands = CustomClient.getInstance().commands.map(command => command.data.toJSON());

            if (!process.env.DISCORD_CLIENT_ID) throw new Error("No Discord client ID was provided. Please provide a client ID in the .env file.");
            if (!process.env.DISCORD_GUILD_ID) throw new Error("No Discord guild ID was provided. Please provide a guild ID in the .env file.");

            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
                { body: commands },
            );

            Logger.success(`Successfully reloaded ${Color.Bright}${(data as any[]).length}${Color.Reset} application (/) commands.`);
        } catch (error) {
            Logger.error(error);
        }
    }
}