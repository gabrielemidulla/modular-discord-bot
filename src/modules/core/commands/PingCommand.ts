import { Command } from "base/Command";
import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export default class PingCommand extends Command {
    public data = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')

    async execute(interaction: CommandInteraction) {
        await interaction.reply('Pong!');
    }
};