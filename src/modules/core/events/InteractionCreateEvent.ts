import { Events } from "discord.js";
import { Event } from "../../../base/Event";
import { Logger } from "../../../utils/Logger";
import { CustomInteraction } from "base/CustomInteraction";

export default class InteractionCreateEvent extends Event<CustomInteraction> {
    public name = Events.InteractionCreate;

    async execute(interaction: CustomInteraction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            Logger.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            Logger.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
}