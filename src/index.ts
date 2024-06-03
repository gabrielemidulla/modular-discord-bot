import { GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { CustomClient } from './CustomClient';
import { CommandLoader } from './CommandLoader';
import { EventLoader } from './EventLoader';
import { CommandRegistrar } from './CommandRegistrar';

config();

const client = CustomClient.getInstance({ intents: [GatewayIntentBits.Guilds] });
const commandLoader = new CommandLoader();
const eventLoader = new EventLoader();

const commandRegistrar = new CommandRegistrar();

const main = async () => {
    // Load commands and events
    await commandLoader.load();
    await eventLoader.load();

    // Register commands
    await commandRegistrar.register();

    // Login to Discord
    client.login(process.env.DISCORD_TOKEN);
};

main();
