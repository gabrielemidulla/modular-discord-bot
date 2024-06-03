import { Command } from 'base/Command';
import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export default class UserCommand extends Command {
    public data = new SlashCommandBuilder()
        .setName('user')
        .setDescription('Provides information about the user.');

    async execute(interaction: CommandInteraction) {
        await interaction.reply(`This command was run by ${interaction.user.username}.`);
    }
};