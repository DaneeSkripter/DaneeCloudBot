require('dotenv').config();
const { GClient, Plugins, Command, Component } = require('gcommands');
const { GatewayIntentBits } = require('discord.js');
const { join } = require('path');
const logger = require("./handlers/logger")
// Set the default onError function for components
Component.setDefaults({
	onError: (ctx, error) => {
		return ctx.reply('Oops! Something went wrong')
	} 
});

// Cloud API

const {Cloud} = require("daneecloud-api")
const cloud = new Cloud({
	cloudUrl: process.env.cloud_url,
	apiKey: process.env.api_key
})

module.exports.cloud = cloud

// Search for plugins in node_modules (folder names starting with gcommands-plugin-) or plugins folder
Plugins.search(__dirname);

const client = new GClient({
	// Register the directories where your commands/components/listeners will be located.
	dirs: [
		join(__dirname, 'commands'),
		join(__dirname, 'components'),
		join(__dirname, 'listeners')
	],
	// Enable message support
	messageSupport: false,
	// Set the prefix for message commands
	messagePrefix: '!',
	// Set the guild where you will be developing your bot. This is usefull cause guild slash commands update instantly.
	devGuildId: process.env.DEV_SERVER,
	// Set the intents you will be using (https://discordjs.guide/popular-topics/intents.html#gateway-intents)
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Login to the discord API
client.login(process.env.TOKEN);