import { Command } from "base/Command";
import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export default class ServerCommand extends Command {
    public data = new SlashCommandBuilder()
        .setName('server')
        .setDescription('Provides information about the server.');

    async execute(interaction: CommandInteraction) {
        await interaction.reply(`This server is ${interaction.guild?.name} and has ${interaction.guild?.memberCount} members.`);
    }
};