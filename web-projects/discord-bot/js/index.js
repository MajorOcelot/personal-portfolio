require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const ytdl = require("ytdl-core");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`🎵 Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;

  // Simple command: !play <youtube-url>
  if (message.content.startsWith("!play ")) {
    const url = message.content.split(" ")[1];
    if (!ytdl.validateURL(url)) {
      return message.reply("❌ Not a valid YouTube URL.");
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply("❗ You need to be in a voice channel first!");

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    const stream = ytdl(url, { filter: "audioonly" });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    message.reply("🎶 Now playing your track!");

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });
  }
});

client.login(process.env.DISCORD_TOKEN);