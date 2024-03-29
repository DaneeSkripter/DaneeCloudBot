const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const Discord = require("discord.js")
const cloud = require("../index.js").cloud;
const md5 = require("md5")

new Command({
	name: 'user',
	description: 'Get informations about user',
	type: [CommandType.SLASH],
    arguments: [
        new Argument({
            name: "username",
            description: "Username of user",
            type: ArgumentType.STRING,
            required: true
        })
    ],
	run: async (ctx) => {
		const username = ctx.arguments.getString("username")
        const user = await cloud.getUser(username)
        if (ctx.member.permissions.has(process.env.admin_perm)) {
            if (user.code == 200) {
            let isVerified;
            if (user.data.isVerified) {
                isVerified = "Yes"
            } else {
                isVerified = "No"
            }
            const embed = new Discord.EmbedBuilder()
                .setTitle(user.data.username)
                .addFields([
                    { name: "Username", value: user.data.username, inline: true},
                    { name: "Email", value: user.data.email, inline: true},
                    { name: "Is verified?", value: isVerified, inline: true},
                    { name: "Used storage", value: `${user.data.usedStorage.toString()} MB`, inline: true},
                    { name: "Role", value: user.data.role, inline: true},
                    { name: "IP Address", value: user.data.ip || "-", inline: true},
                ])
                .setThumbnail("https://www.gravatar.com/avatar/" + md5(user.data.email))
                .setColor("#5D3FD3")
            ctx.reply({ embeds: [embed], ephemeral: true})
            } else if (user.code == 404) {
                const err = new Discord.EmbedBuilder()
                .setTitle("User not found")
                .setColor("#FF9494")
            ctx.reply({ embeds: [err], ephemeral: true})
           } else if (user.code == 401) {
            const err = new Discord.EmbedBuilder()
            .setTitle("API: Invalid API Key")
            .setColor("#FF9494")
        ctx.reply({ embeds: [err], ephemeral: true})
           }
        } else {
            const err = new Discord.EmbedBuilder()
                .setTitle("You have no permission to do that.")
                .setColor("#FF9494")
            ctx.reply({ embeds: [err], ephemeral: true})
        }
	}
});
