//24/7
const express = require('express');
const app = express();

app.get('/', function(req, res) {
	res.send('Powered by ⚡ImNotABot⚡ Support');
});

let port = process.env.PORT || 3000;
app.listen(port);

require('dotenv').config();

//const
const Discord = require("discord.js")
const client = new Discord.Client({ intents: 32509 })
const config = require("./config.json")

const fs = require('fs');
let { readdirSync } = require('fs');

//handle slash

client.slashcommands = new Discord.Collection()
const slashcommandsFiles = fs.readdirSync("./SlashCmds").filter(file => file.endsWith(".js"))

for(const file of slashcommandsFiles){
  const slash = require(`./SlashCmds/${file}`)
  console.log(`Slash Commands - ${file} Loaded!`)
  client.slashcommands.set(slash.data.name, slash)
}

//handle commands

client.commands = new Discord.Collection()
let carpetas = fs.readdirSync('./commands/').map((subCarpetas) => {
  const archivos = fs.readdirSync(`./commands/${subCarpetas}`).map((comandos) => {
    let comando = require(`./commands/${subCarpetas}/${comandos}`)
    client.commands.set(comando.name, comando)
  })
})


client.on("ready", message => {
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const commands = []
const slashcommandsFiles = fs.readdirSync("./SlashCmds").filter(file => file.endsWith(".js"))

for(const file of slashcommandsFiles){
  const slash = require(`./SlashCmds/${file}`)
  commands.push(slash.data.toJSON())
}

const rest = new REST({ version: "9" }).setToken(config.token)

createSlash()

async function createSlash(){
  try{
    await rest.put(
      Routes.applicationCommands(config.clientId), {
        body: commands
      }
    )
    console.log("Slash Commands Is loaded of Json!")
  } catch(e) {
    console.log(e)
  }
}

})

client.on("ready", message => {
  console.log("bot: " + client.user.tag + ", Powered by ⚡ImNotABot⚡ Support")
})

client.on("interactionCreate", async (interaction) => {
  if(!interaction.isCommand()) return;

  const slashcmds = client.slashcommands.get(interaction.commandName)

  if(!slashcmds) return;

  try{
    await slashcmds.run(client, interaction)
  } catch(e) {
    console.error(e)
  }
})

client.on("messageCreate", async (message) => {

  let prefix = config.prefix

  if(!message.content.startsWith(prefix)) return;
  if(message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  let cmd = client.commands.find((c) => c.name === command || c.alias && c.alias.includes(command));
  if(cmd){
    try {
      cmd.execute(client, message, args)
    } catch (e) {
  
  return;
}

}
});

client.login(config.token)