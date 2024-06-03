import { GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { CustomClient } from './utils/CustomClient';
import { CommandRegistrar } from './utils/CommandRegistrar';
import { ModuleLoader } from 'loaders/ModuleLoader';

config();

const client = CustomClient.getInstance({ intents: [GatewayIntentBits.Guilds] });

const moduleLoader = new ModuleLoader('modules');
const commandRegistrar = new CommandRegistrar();

const main = async () => {
    // Load modules
    await moduleLoader.load();

    // Register commands
    await commandRegistrar.register();

    // Login to Discord
    client.login(process.env.DISCORD_TOKEN);
};

main();
