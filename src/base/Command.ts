import { CommandInteraction, SlashCommandBuilder } from "discord.js";


export class Command {
    public data: SlashCommandBuilder;

    constructor(data: SlashCommandBuilder) {
        this.data = data;
    }

    async execute(interaction: CommandInteraction) { };
}