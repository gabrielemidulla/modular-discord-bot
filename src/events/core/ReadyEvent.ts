import { Client, Events } from "discord.js";
import { Event } from "../../base/Event";
import { Logger } from "../../utils/Logger";


export default class ReadyEvent extends Event<Client> {
    public name = Events.ClientReady;
    public once = true;

    async execute(client: Client) {
        Logger.success(`Ready! Logged in as ${client?.user?.tag}`);
    }
}