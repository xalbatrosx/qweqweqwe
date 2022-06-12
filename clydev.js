const { Client, Intents, Collection, MessageAttachment, MessageEmbed, Permissions, Constants, ApplicationCommandPermissionsManager } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MEMBERS,Intents.FLAGS.GUILD_BANS,Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,Intents.FLAGS.GUILD_INTEGRATIONS,Intents.FLAGS.GUILD_WEBHOOKS,Intents.FLAGS.GUILD_INVITES,Intents.FLAGS.GUILD_VOICE_STATES,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Intents.FLAGS.GUILD_MESSAGE_TYPING,Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,Intents.FLAGS.DIRECT_MESSAGE_TYPING] });
const ayarlar = require("./settings.json");
const Discord = require("discord.js")
const db = require("nrc.db");
const ms = require("ms")
const message = require("./events/message");
const { DiscordFivemApi } = require('discord-fivem-api');
let prefix = ayarlar.prefix;

client.commands = new Collection();
client.aliases = new Collection();

["command"].forEach(handler => {
  require(`./komutcalistirici`)(client);
}); 

client.on("ready", () => {
  require("./events/eventLoader")(client);
});

client.on("guildMemberAdd", async (member, message) => {

    let guild = member.guild;

    let tag = db.fetch(`yasaklıtag.${member.guild.id}`);
    if (!tag) return;
    let tagrol = db.fetch(`tagrol.${member.guild.id}`)
    if (!tagrol) return;
    let taglog = db.fetch(`tagkanal.${member.guild.id}`)
    let kanal = member.guild.channels.cache.get(taglog)
    let rol = member.guild.roles.cache.get(tagrol).name
    setTimeout(() => {
        if (!tag.some(yasak => member.user.username.includes(yasak))) return;
        let tag;
        tag.forEach(a => {
            if (member.user.username.includes(a)) tag = a
        })
        member.roles.set([`${tagrol}`])
        member.send(new Discord.MessageEmbed()
            .setColor(client.ayarlar.embedRenk)
            .setTitle(`Hop Birader Nereye`)
            .setDescription(` \`${guild.name}\` Sunucusunda Yasaklı TAG'da bulunuyorsunuz\n Sunucu içi yetkililere ulaşarak yasaklıtag'dan çıkabilirsin çıkabilirsin.`));
    });

    kanal.send(new Discord.MessageEmbed()
        .setColor(client.ayarlar.embedRenk)
        .setTitle(`Radarız Kardeş`)
        .setDescription(` ${message.author.username} Yasaklı tag'da bulunduğu için gerekli bilgileri buraya yolladım. `)
    );
});