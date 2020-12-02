// require the discord.js module
const fs = require('fs');
global.Discord = require('discord.js');
global.Crawler = require("crawler");
global.prefix = ["!"];


// create a new discord client
client = new Discord.Client();
client.commands = new Discord.Collection();

global.fetch = require('node-fetch');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

// update weather on startup
client.once('ready', () => {
	client.commands.get('weatherFetch').execute();
})

// get the date/time
client.on('ready', () => {
	var d = new Date();
	var min = d.getMinutes();

	// determine how many minutes until 10 after
	var timeoutDelay = 10 - min;
	if (timeoutDelay <= 0) {
		timeoutDelay = timeoutDelay + 60;
	}

	// run once again on next 00:10, then every hour afterwards.
	setTimeout(function() {
		client.commands.get('weatherFetch').execute();
		setInterval(function() {client.commands.get('weatherFetch').execute();}, 60*60*1000)
	}, timeoutDelay*60*1000);
	
	
	
});


client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	
	
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	

	if (!command) return;

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}


});
/*
client.on('message', message => {
	if (!message.content.startsWith(".") || message.author.bot) return;

	const args = message.content.slice(1).trim().split(/ +/);
	

	const commandName = "ygoBeta".toLowerCase();

	
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}


});
*/
client.on('message', message => {
	if (!message.content.startsWith("(╯°□°）╯︵ ┻━┻") || message.author.bot) return;

	const args = message.content.slice(1).trim().split(/ +/);
	

	const commandName = "ygoBeta".toLowerCase();

	
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	return message.channel.send('┬─┬ ノ( ゜-゜ノ)');


	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}


});

//classic hi5 handler

client.on('message', message => {
	if (message.author.bot) return;
	if (!message.content.includes('o/') && !message.content.includes('\\o')) return;


	const commandName = "hi5Gif".toLowerCase();
	
	
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		
	try {
		command.execute(message);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}


});


if (fs.existsSync("./config.json")) {
	const config = require("./config.json");
	client.login(config.token);
} else {
	client.login(process.env.token);
}
// for local use:
//client.login(token);
// heroku:

