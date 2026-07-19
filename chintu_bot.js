// Code By CHINTU
// WhatsApp Group Management Bot - 300+ Commands

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const moment = require('moment-timezone');
const axios = require('axios');
const fs = require('fs-extra');
const chalk = require('chalk');
const crypto = require('crypto-js');
const shortid = require('shortid');
const emoji = require('node-emoji');
const figlet = require('figlet');
const randomWords = require('random-words');
const cron = require('node-cron');

// ============= CONFIG =============
const ADMIN_NUMBER = '9412185706'; // LO's number
const BOT_NAME = 'CHINTU';
const PREFIX = '!';
const SESSION_DIR = './auth/session';
const COMMANDS_DIR = './commands';

// ============= SETUP =============
const app = express();
const port = process.env.PORT || 3000;

// Health check for Render
app.get('/', (req, res) => {
  res.send(`🤖 ${BOT_NAME} Bot is running!`);
});
app.listen(port, () => {
  console.log(chalk.green(`✅ Server running on port ${port}`));
});

// ============= CLIENT =============
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: SESSION_DIR
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// ============= COMMAND REGISTRY =============
// Admin can customize these in config later
const commandCategories = {
  admin: [],
  utility: [],
  fun: [],
  media: [],
  moderation: [],
  info: [],
  chat: [],
  misc: []
};

const commandMap = new Map();

// ============= ================= =============
// ============= COMMAND DEFINITIONS =============
// ============= ================= =============

// -------- ADMIN COMMANDS (40+) --------
function registerAdminCommands() {
  const cmds = [
    { name: 'add', desc: 'Add member to group', usage: '!add 91xxxxxxxxxx' },
    { name: 'remove', desc: 'Remove member from group', usage: '!remove @mention' },
    { name: 'promote', desc: 'Promote to admin', usage: '!promote @mention' },
    { name: 'demote', desc: 'Demote from admin', usage: '!demote @mention' },
    { name: 'kickall', desc: 'Kick all members except admin', usage: '!kickall' },
    { name: 'mute', desc: 'Mute a member', usage: '!mute @mention' },
    { name: 'unmute', desc: 'Unmute a member', usage: '!unmute @mention' },
    { name: 'ban', desc: 'Ban a member', usage: '!ban @mention' },
    { name: 'unban', desc: 'Unban a member', usage: '!unban @mention' },
    { name: 'warn', desc: 'Warn a member', usage: '!warn @mention reason' },
    { name: 'warnings', desc: 'View warnings of a member', usage: '!warnings @mention' },
    { name: 'resetwarns', desc: 'Reset warnings of a member', usage: '!resetwarns @mention' },
    { name: 'lockdown', desc: 'Lock group (only admins can send)', usage: '!lockdown' },
    { name: 'unlock', desc: 'Unlock group', usage: '!unlock' },
    { name: 'setlink', desc: 'Set group invite link', usage: '!setlink [link]' },
    { name: 'grouplink', desc: 'Get group invite link', usage: '!grouplink' },
    { name: 'setdesc', desc: 'Set group description', usage: '!setdesc [text]' },
    { name: 'setname', desc: 'Set group name', usage: '!setname [name]' },
    { name: 'setpp', desc: 'Set group profile picture', usage: '!setpp [image]' },
    { name: 'announce', desc: 'Announce to all groups', usage: '!announce [message]' },
    { name: 'bc', desc: 'Broadcast message to all groups', usage: '!bc [message]' },
    { name: 'welcome', desc: 'Toggle welcome messages', usage: '!welcome on/off' },
    { name: 'setwelcome', desc: 'Set custom welcome message', usage: '!setwelcome [text]' },
    { name: 'goodbye', desc: 'Toggle goodbye messages', usage: '!goodbye on/off' },
    { name: 'setgoodbye', desc: 'Set custom goodbye message', usage: '!setgoodbye [text]' },
    { name: 'antilink', desc: 'Toggle anti-link protection', usage: '!antilink on/off' },
    { name: 'antispam', desc: 'Toggle anti-spam protection', usage: '!antispam on/off' },
    { name: 'antibadword', desc: 'Toggle bad word filter', usage: '!antibadword on/off' },
    { name: 'addbadword', desc: 'Add bad word to filter', usage: '!addbadword [word]' },
    { name: 'removebadword', desc: 'Remove bad word from filter', usage: '!removebadword [word]' },
    { name: 'badwords', desc: 'List all bad words', usage: '!badwords' },
    { name: 'slowmode', desc: 'Set slow mode in seconds', usage: '!slowmode [seconds]' },
    { name: 'clearchat', desc: 'Clear chat history', usage: '!clearchat' },
    { name: 'status', desc: 'Check bot status', usage: '!status' },
    { name: 'restart', desc: 'Restart the bot', usage: '!restart' },
    { name: 'shutdown', desc: 'Shutdown the bot', usage: '!shutdown' },
    { name: 'eval', desc: 'Evaluate JavaScript code', usage: '!eval [code]' },
    { name: 'exec', desc: 'Execute terminal command', usage: '!exec [command]' },
    { name: 'setprefix', desc: 'Set custom command prefix', usage: '!setprefix [prefix]' },
    { name: 'helpadmin', desc: 'Show admin commands', usage: '!helpadmin' },
  ];
  cmds.forEach(c => { c.category = 'admin'; commandMap.set(c.name, c); });
  commandCategories.admin = cmds;
}

// -------- UTILITY COMMANDS (50+) --------
function registerUtilityCommands() {
  const cmds = [
    { name: 'ping', desc: 'Check bot latency', usage: '!ping' },
    { name: 'uptime', desc: 'Check bot uptime', usage: '!uptime' },
    { name: 'weather', desc: 'Get weather of a city', usage: '!weather [city]' },
    { name: 'time', desc: 'Get current time of a city', usage: '!time [city]' },
    { name: 'date', desc: 'Get current date', usage: '!date' },
    { name: 'calc', desc: 'Calculate mathematical expression', usage: '!calc [expression]' },
    { name: 'convert', desc: 'Convert currency', usage: '!convert [amount] [from] [to]' },
    { name: 'qr', desc: 'Generate QR code', usage: '!qr [text]' },
    { name: 'url', desc: 'Shorten a URL', usage: '!url [link]' },
    { name: 'password', desc: 'Generate strong password', usage: '!password [length]' },
    { name: 'uuid', desc: 'Generate UUID', usage: '!uuid' },
    { name: 'base64', desc: 'Encode text to Base64', usage: '!base64 [text]' },
    { name: 'unbase64', desc: 'Decode Base64 to text', usage: '!unbase64 [text]' },
    { name: 'hash', desc: 'Generate MD5/SHA hash', usage: '!hash [text]' },
    { name: 'random', desc: 'Generate random number', usage: '!random [min] [max]' },
    { name: 'dice', desc: 'Roll a dice', usage: '!dice' },
    { name: 'coin', desc: 'Flip a coin', usage: '!coin' },
    { name: '8ball', desc: 'Ask the magic 8ball', usage: '!8ball [question]' },
    { name: 'rps', desc: 'Rock paper scissors', usage: '!rps [rock/paper/scissors]' },
    { name: 'trivia', desc: 'Get a random trivia question', usage: '!trivia' },
    { name: 'fact', desc: 'Get a random fact', usage: '!fact' },
    { name: 'quote', desc: 'Get a random quote', usage: '!quote' },
    { name: 'joke', desc: 'Get a random joke', usage: '!joke' },
    { name: 'meme', desc: 'Get a random meme', usage: '!meme' },
    { name: 'advice', desc: 'Get random advice', usage: '!advice' },
    { name: 'lyrics', desc: 'Get song lyrics', usage: '!lyrics [song]' },
    { name: 'translate', desc: 'Translate text', usage: '!translate [text] to [language]' },
    { name: 'define', desc: 'Define a word', usage: '!define [word]' },
    { name: 'synonym', desc: 'Find synonym of a word', usage: '!synonym [word]' },
    { name: 'antonym', desc: 'Find antonym of a word', usage: '!antonym [word]' },
    { name: 'wiki', desc: 'Search Wikipedia', usage: '!wiki [query]' },
    { name: 'news', desc: 'Get latest news', usage: '!news [category]' },
    { name: 'crypto', desc: 'Get cryptocurrency price', usage: '!crypto [coin]' },
    { name: 'stocks', desc: 'Get stock price', usage: '!stocks [symbol]' },
    { name: 'bitcoin', desc: 'Get Bitcoin price', usage: '!bitcoin' },
    { name: 'ethereum', desc: 'Get Ethereum price', usage: '!ethereum' },
    { name: 'agecalc', desc: 'Calculate age from DOB', usage: '!agecalc [DD/MM/YYYY]' },
    { name: 'countdown', desc: 'Countdown to a date', usage: '!countdown [DD/MM/YYYY]' },
    { name: 'remind', desc: 'Set a reminder', usage: '!remind [time] [message]' },
    { name: 'todo', desc: 'Add todo item', usage: '!todo [task]' },
    { name: 'todos', desc: 'List all todos', usage: '!todos' },
    { name: 'removetodo', desc: 'Remove a todo', usage: '!removetodo [index]' },
    { name: 'poll', desc: 'Create a poll', usage: '!poll [question] [option1] [option2] ...' },
    { name: 'vote', desc: 'Vote on a poll', usage: '!vote [option]' },
    { name: 'bmi', desc: 'Calculate BMI', usage: '!bmi [height] [weight]' },
    { name: 'emoji', desc: 'Get info about an emoji', usage: '!emoji [emoji]' },
    { name: 'charinfo', desc: 'Get info about a character', usage: '!charinfo [char]' },
    { name: 'urban', desc: 'Search Urban Dictionary', usage: '!urban [word]' },
    { name: 'pronounce', desc: 'Get pronunciation of a word', usage: '!pronounce [word]' },
    { name: 'anagram', desc: 'Find anagrams of a word', usage: '!anagram [word]' },
    { name: 'palindrome', desc: 'Check if text is palindrome', usage: '!palindrome [text]' },
  ];
  cmds.forEach(c => { c.category = 'utility'; commandMap.set(c.name, c); });
  commandCategories.utility = cmds;
}

// -------- FUN COMMANDS (60+) --------
function registerFunCommands() {
  const cmds = [
    { name: 'truth', desc: 'Get a truth question', usage: '!truth' },
    { name: 'dare', desc: 'Get a dare challenge', usage: '!dare' },
    { name: 'truthordare', desc: 'Truth or Dare', usage: '!truthordare' },
    { name: 'wouldyourather', desc: 'Would you rather?', usage: '!wouldyourather' },
    { name: 'neverhaveiever', desc: 'Never have I ever', usage: '!neverhaveiever' },
    { name: 'insult', desc: 'Insult someone', usage: '!insult @mention' },
    { name: 'roast', desc: 'Roast someone', usage: '!roast @mention' },
    { name: 'compliment', desc: 'Compliment someone', usage: '!compliment @mention' },
    { name: 'hug', desc: 'Hug someone', usage: '!hug @mention' },
    { name: 'kiss', desc: 'Kiss someone', usage: '!kiss @mention' },
    { name: 'slap', desc: 'Slap someone', usage: '!slap @mention' },
    { name: 'punch', desc: 'Punch someone', usage: '!punch @mention' },
    { name: 'kick', desc: 'Kick someone', usage: '!kick @mention' },
    { name: 'lick', desc: 'Lick someone', usage: '!lick @mention' },
    { name: 'bite', desc: 'Bite someone', usage: '!bite @mention' },
    { name: 'shoot', desc: 'Shoot someone', usage: '!shoot @mention' },
    { name: 'stab', desc: 'Stab someone', usage: '!stab @mention' },
    { name: 'marry', desc: 'Propose someone', usage: '!marry @mention' },
    { name: 'divorce', desc: 'Divorce someone', usage: '!divorce @mention' },
    { name: 'ship', desc: 'Ship two people', usage: '!ship @mention1 @mention2' },
    { name: 'gender', desc: 'Guess someone\'s gender', usage: '!gender [name]' },
    { name: 'age', desc: 'Guess someone\'s age', usage: '!age [name]' },
    { name: 'iq', desc: 'Calculate IQ', usage: '!iq [name]' },
    { name: 'dnd', desc: 'Roll D&D dice', usage: '!dnd [dice]' },
    { name: 'pp', desc: 'Measure dick size', usage: '!pp [name]' },
    { name: 'ass', desc: 'Measure ass size', usage: '!ass [name]' },
    { name: 'rated', desc: 'Rate someone', usage: '!rated [name]' },
    { name: 'hot', desc: 'Rate hotness', usage: '!hot [name]' },
    { name: 'bruh', desc: 'BRUH moment', usage: '!bruh' },
    { name: 'lol', desc: 'LOL moment', usage: '!lol' },
    { name: 'rip', desc: 'Pay respects', usage: '!rip [name]' },
    { name: 'f', desc: 'Pay respects (F)', usage: '!f' },
    { name: 'gg', desc: 'Good game', usage: '!gg' },
    { name: 'wp', desc: 'Well played', usage: '!wp' },
    { name: 'ez', desc: 'EZ clap', usage: '!ez' },
    { name: 'cringe', desc: 'Cringe reaction', usage: '!cringe' },
    { name: 'based', desc: 'Based reaction', usage: '!based' },
    { name: 'sus', desc: 'Sus reaction', usage: '!sus' },
    { name: 'cap', desc: 'Cap/No cap', usage: '!cap' },
    { name: 'bet', desc: 'Bet response', usage: '!bet' },
    { name: 'fr', desc: 'For real', usage: '!fr' },
    { name: 'npc', desc: 'NPC energy', usage: '!npc' },
    { name: 'mainchar', desc: 'Main character energy', usage: '!mainchar' },
    { name: 'villain', desc: 'Villain energy', usage: '!villain' },
    { name: 'hacker', desc: 'Hacker moment', usage: '!hacker' },
    { name: 'hackerman', desc: 'Hackerman meme', usage: '!hackerman' },
    { name: 'morbin', desc: 'It\'s morbin time', usage: '!morbin' },
    { name: 'amongus', desc: 'Among Us meme', usage: '!amongus' },
    { name: 'skibidi', desc: 'Skibidi toilet', usage: '!skibidi' },
    { name: 'sigma', desc: 'Sigma male', usage: '!sigma' },
    { name: 'gigachad', desc: 'Gigachad meme', usage: '!gigachad' },
    { name: 'betamale', desc: 'Beta male', usage: '!betamale' },
    { name: 'womenmoment', desc: 'Women moment', usage: '!womenmoment' },
    { name: 'menmoment', desc: 'Men moment', usage: '!menmoment' },
    { name: 'cat', desc: 'Random cat image', usage: '!cat' },
    { name: 'dog', desc: 'Random dog image', usage: '!dog' },
    { name: 'fox', desc: 'Random fox image', usage: '!fox' },
    { name: 'bird', desc: 'Random bird image', usage: '!bird' },
    { name: 'panda', desc: 'Random panda image', usage: '!panda' },
    { name: 'koala', desc: 'Random koala image', usage: '!koala' },
    { name: 'redpanda', desc: 'Random red panda image', usage: '!redpanda' },
    { name: 'wojak', desc: 'Wojak meme', usage: '!wojak' },
    { name: 'chad', desc: 'Chad meme', usage: '!chad' },
  ];
  cmds.forEach(c => { c.category = 'fun'; commandMap.set(c.name, c); });
  commandCategories.fun = cmds;
}

// -------- INFO COMMANDS (30+) --------
function registerInfoCommands() {
  const cmds = [
    { name: 'help', desc: 'Show help menu', usage: '!help' },
    { name: 'helpall', desc: 'Show all commands', usage: '!helpall' },
    { name: 'about', desc: 'About the bot', usage: '!about' },
    { name: 'botinfo', desc: 'Bot information', usage: '!botinfo' },
    { name: 'groupinfo', desc: 'Group information', usage: '!groupinfo' },
    { name: 'userinfo', desc: 'User information', usage: '!userinfo [@mention]' },
    { name: 'adminlist', desc: 'List all admins', usage: '!adminlist' },
    { name: 'membercount', desc: 'Group member count', usage: '!membercount' },
    { name: 'groups', desc: 'List all groups bot is in', usage: '!groups' },
    { name: 'commands', desc: 'List all commands', usage: '!commands [category]' },
    { name: 'cmdinfo', desc: 'Get info about a command', usage: '!cmdinfo [command]' },
    { name: 'ping', desc: 'Check bot ping', usage: '!ping' },
    { name: 'uptime', desc: 'Bot uptime', usage: '!uptime' },
    { name: 'memory', desc: 'Memory usage', usage: '!memory' },
    { name: 'cpu', desc: 'CPU usage', usage: '!cpu' },
    { name: 'lastseen', desc: 'Last seen of a user', usage: '!lastseen [@mention]' },
    { name: 'joined', desc: 'When user joined', usage: '!joined [@mention]' },
    { name: 'rank', desc: 'User rank in group', usage: '!rank [@mention]' },
    { name: 'leaderboard', desc: 'Group leaderboard', usage: '!leaderboard' },
    { name: 'level', desc: 'User level', usage: '!level [@mention]' },
    { name: 'xp', desc: 'User XP', usage: '!xp [@mention]' },
    { name: 'social', desc: 'Social media links', usage: '!social' },
    { name: 'donate', desc: 'Donation links', usage: '!donate' },
    { name: 'support', desc: 'Support server info', usage: '!support' },
    { name: 'website', desc: 'Bot website', usage: '!website' },
    { name: 'source', desc: 'Bot source code', usage: '!source' },
    { name: 'credits', desc: 'Bot credits', usage: '!credits' },
    { name: 'version', desc: 'Bot version', usage: '!version' },
    { name: 'changelog', desc: 'Bot changelog', usage: '!changelog' },
    { name: 'todo', desc: 'Bot TODO list', usage: '!todo' },
    { name: 'invite', desc: 'Invite bot to group', usage: '!invite' },
  ];
  cmds.forEach(c => { c.category = 'info'; commandMap.set(c.name, c); });
  commandCategories.info = cmds;
}

// -------- MODERATION COMMANDS (30+) --------
function registerModerationCommands() {
  const cmds = [
    { name: 'antilink', desc: 'Toggle anti-link', usage: '!antilink on/off' },
    { name: 'antispam', desc: 'Toggle anti-spam', usage: '!antispam on/off' },
    { name: 'antibadword', desc: 'Toggle bad word filter', usage: '!antibadword on/off' },
    { name: 'addbadword', desc: 'Add bad word', usage: '!addbadword [word]' },
    { name: 'removebadword', desc: 'Remove bad word', usage: '!removebadword [word]' },
    { name: 'badwords', desc: 'List bad words', usage: '!badwords' },
    { name: 'slowmode', desc: 'Set slow mode', usage: '!slowmode [seconds]' },
    { name: 'slowmodeoff', desc: 'Turn off slow mode', usage: '!slowmodeoff' },
    { name: 'mute', desc: 'Mute user', usage: '!mute [@mention] [reason]' },
    { name: 'unmute', desc: 'Unmute user', usage: '!unmute [@mention]' },
    { name: 'mutedlist', desc: 'List muted users', usage: '!mutedlist' },
    { name: 'ban', desc: 'Ban user', usage: '!ban [@mention] [reason]' },
    { name: 'unban', desc: 'Unban user', usage: '!unban [@mention]' },
    { name: 'bannedlist', desc: 'List banned users', usage: '!bannedlist' },
    { name: 'warn', desc: 'Warn user', usage: '!warn [@mention] [reason]' },
    { name: 'warnings', desc: 'View warnings', usage: '!warnings [@mention]' },
    { name: 'resetwarns', desc: 'Reset warnings', usage: '!resetwarns [@mention]' },
    { name: 'kick', desc: 'Kick user', usage: '!kick [@mention] [reason]' },
    { name: 'kickall', desc: 'Kick all non-admin', usage: '!kickall' },
    { name: 'lockdown', desc: 'Lock group', usage: '!lockdown' },
    { name: 'unlock', desc: 'Unlock group', usage: '!unlock' },
    { name: 'clearchat', desc: 'Clear chat', usage: '!clearchat' },
    { name: 'delete', desc: 'Delete message', usage: '!delete [reply]' },
    { name: 'purge', desc: 'Purge messages', usage: '!purge [count]' },
    { name: 'welcome', desc: 'Toggle welcome', usage: '!welcome on/off' },
    { name: 'goodbye', desc: 'Toggle goodbye', usage: '!goodbye on/off' },
    { name: 'setwelcome', desc: 'Set welcome message', usage: '!setwelcome [text]' },
    { name: 'setgoodbye', desc: 'Set goodbye message', usage: '!setgoodbye [text]' },
    { name: 'testwelcome', desc: 'Test welcome message', usage: '!testwelcome' },
    { name: 'testgoodbye', desc: 'Test goodbye message', usage: '!testgoodbye' },
    { name: 'antilinklist', desc: 'List anti-link domains', usage: '!antilinklist' },
    { name: 'addlink', desc: 'Add link to anti-link', usage: '!addlink [domain]' },
    { name: 'removelink', desc: 'Remove link from anti-link', usage: '!removelink [domain]' },
  ];
  cmds.forEach(c => { c.category = 'moderation'; commandMap.set(c.name, c); });
  commandCategories.moderation = cmds;
}

// -------- MEDIA COMMANDS (30+) --------
function registerMediaCommands() {
  const cmds = [
    { name: 'sticker', desc: 'Create sticker from image', usage: '!sticker [reply to image]' },
    { name: 'stickertext', desc: 'Create text sticker', usage: '!stickertext [text]' },
    { name: 'stickergif', desc: 'Create sticker from GIF', usage: '!stickergif [reply to GIF]' },
    { name: 'take', desc: 'Create sticker with custom text', usage: '!take [top] [bottom] [reply]' },
    { name: 'img2sticker', desc: 'Image to sticker', usage: '!img2sticker [reply]' },
    { name: 'gif', desc: 'Search GIF', usage: '!gif [query]' },
    { name: 'gif2sticker', desc: 'GIF to sticker', usage: '!gif2sticker [reply to GIF]' },
    { name: 'image', desc: 'Search image', usage: '!image [query]' },
    { name: 'pinterest', desc: 'Search Pinterest', usage: '!pinterest [query]' },
    { name: 'insta', desc: 'Instagram downloader', usage: '!insta [link]' },
    { name: 'yt', desc: 'YouTube downloader', usage: '!yt [link]' },
    { name: 'ytmp3', desc: 'YouTube to MP3', usage: '!ytmp3 [link]' },
    { name: 'ytmp4', desc: 'YouTube to MP4', usage: '!ytmp4 [link]' },
    { name: 'tiktok', desc: 'TikTok downloader', usage: '!tiktok [link]' },
    { name: 'fb', desc: 'Facebook downloader', usage: '!fb [link]' },
    { name: 'twitter', desc: 'Twitter/X downloader', usage: '!twitter [link]' },
    { name: 'reddit', desc: 'Reddit downloader', usage: '!reddit [link]' },
    { name: 'spotify', desc: 'Spotify search', usage: '!spotify [query]' },
    { name: 'soundcloud', desc: 'SoundCloud search', usage: '!soundcloud [query]' },
    { name: 'audio', desc: 'Audio effects', usage: '!audio [effect]' },
    { name: 'tts', desc: 'Text to speech', usage: '!tts [text]' },
    { name: 'ttsvoice', desc: 'TTS with voice selection', usage: '!ttsvoice [voice] [text]' },
    { name: 'caption', desc: 'Add caption to image', usage: '!caption [text] [reply to image]' },
    { name: 'blur', desc: 'Blur an image', usage: '!blur [reply to image]' },
    { name: 'brightness', desc: 'Adjust brightness', usage: '!brightness [level] [reply]' },
    { name: 'contrast', desc: 'Adjust contrast', usage: '!contrast [level] [reply]' },
    { name: 'rotate', desc: 'Rotate image', usage: '!rotate [degrees] [reply]' },
    { name: 'flip', desc: 'Flip image', usage: '!flip [reply]' },
    { name: 'mirror', desc: 'Mirror image', usage: '!mirror [reply]' },
    { name: 'circle', desc: 'Make image circular', usage: '!circle [reply]' },
    { name: 'resize', desc: 'Resize image', usage: '!resize [width] [height] [reply]' },
    { name: 'compress', desc: 'Compress image', usage: '!compress [reply]' },
  ];
  cmds.forEach(c => { c.category = 'media'; commandMap.set(c.name, c); });
  commandCategories.media = cmds;
}

// -------- CHAT INTERACTION COMMANDS (40+) --------
function registerChatCommands() {
  const cmds = [
    { name: 'say', desc: 'Make bot say something', usage: '!say [text]' },
    { name: 'echo', desc: 'Echo a message', usage: '!echo [text]' },
    { name: 'repeat', desc: 'Repeat message', usage: '!repeat [count] [text]' },
    { name: 'react', desc: 'React to a message', usage: '!react [emoji] [reply]' },
    { name: 'reply', desc: 'Reply to a message', usage: '!reply [text] [reply]' },
    { name: 'greet', desc: 'Greet someone', usage: '!greet [@mention]' },
    { name: 'welcomeall', desc: 'Welcome all new members', usage: '!welcomeall' },
    { name: 'birthday', desc: 'Set birthday', usage: '!birthday [DD/MM]' },
    { name: 'happybirthday', desc: 'Wish someone', usage: '!happybirthday [@mention]' },
    { name: 'remindme', desc: 'Remind me later', usage: '!remindme [time] [message]' },
    { name: 'reminders', desc: 'List reminders', usage: '!reminders' },
    { name: 'cancelremind', desc: 'Cancel a reminder', usage: '!cancelremind [id]' },
    { name: 'notes', desc: 'Save a note', usage: '!notes [text]' },
    { name: 'mynotes', desc: 'View my notes', usage: '!mynotes' },
    { name: 'removenote', desc: 'Remove a note', usage: '!removenote [index]' },
    { name: 'profile', desc: 'View user profile', usage: '!profile [@mention]' },
    { name: 'setbio', desc: 'Set bio', usage: '!setbio [text]' },
    { name: 'setname', desc: 'Set nickname', usage: '!setname [name]' },
    { name: 'setage', desc: 'Set age', usage: '!setage [age]' },
    { name: 'setgender', desc: 'Set gender', usage: '!setgender [gender]' },
    { name: 'setcity', desc: 'Set city', usage: '!setcity [city]' },
    { name: 'setstatus', desc: 'Set status', usage: '!setstatus [status]' },
    { name: 'mystats', desc: 'View my stats', usage: '!mystats' },
    { name: 'top', desc: 'Leaderboard', usage: '!top [category]' },
    { name: 'levelup', desc: 'Level up message', usage: '!levelup' },
    { name: 'daily', desc: 'Daily reward', usage: '!daily' },
    { name: 'weekly', desc: 'Weekly reward', usage: '!weekly' },
    { name: 'coins', desc: 'Check coins', usage: '!coins' },
    { name: 'givecoins', desc: 'Give coins to someone', usage: '!givecoins [amount] [@mention]' },
    { name: 'shop', desc: 'Shop items', usage: '!shop' },
    { name: 'buy', desc: 'Buy an item', usage: '!buy [item]' },
    { name: 'inventory', desc: 'Check inventory', usage: '!inventory' },
    { name: 'gamble', desc: 'Gamble coins', usage: '!gamble [amount]' },
    { name: 'blackjack', desc: 'Play blackjack', usage: '!blackjack [bet]' },
    { name: 'slots', desc: 'Play slots', usage: '!slots [bet]' },
    { name: 'roulette', desc: 'Play roulette', usage: '!roulette [bet] [color/number]' },
    { name: 'marry', desc: 'Marry someone', usage: '!marry [@mention]' },
    { name: 'divorce', desc: 'Divorce', usage: '!divorce' },
    { name: 'lovecalc', desc: 'Love calculator', usage: '!lovecalc [name1] [name2]' },
    { name: 'friendzone', desc: 'Friendzone someone', usage: '!friendzone [@mention]' },
    { name: 'confess', desc: 'Confess to someone', usage: '!confess [@mention] [message]' },
    { name: 'anonymous', desc: 'Send anonymous message', usage: '!anonymous [@mention] [message]' },
  ];
  cmds.forEach(c => { c.category = 'chat'; commandMap.set(c.name, c); });
  commandCategories.chat = cmds;
}

// -------- MISC COMMANDS (20+) --------
function registerMiscCommands() {
  const cmds = [
    { name: 'custom', desc: 'Create custom command', usage: '!custom [name] [response]' },
    { name: 'delcustom', desc: 'Delete custom command', usage: '!delcustom [name]' },
    { name: 'listcustom', desc: 'List custom commands', usage: '!listcustom' },
    { name: 'autor', desc: 'Set auto reply', usage: '!autor [trigger] [response]' },
    { name: 'delautor', desc: 'Delete auto reply', usage: '!delautor [trigger]' },
    { name: 'listautor', desc: 'List auto replies', usage: '!listautor' },
    { name: 'tagall', desc: 'Tag all members', usage: '!tagall [message]' },
    { name: 'tagadmin', desc: 'Tag all admins', usage: '!tagadmin [message]' },
    { name: 'taghere', desc: 'Tag online members', usage: '!taghere [message]' },
    { name: 'poll', desc: 'Create poll', usage: '!poll [question] [option1] [option2]' },
    { name: 'vote', desc: 'Vote in poll', usage: '!vote [option]' },
    { name: 'pollresults', desc: 'View poll results', usage: '!pollresults' },
    { name: 'endpoll', desc: 'End a poll', usage: '!endpoll' },
    { name: 'quote', desc: 'Save quote', usage: '!quote [text]' },
    { name: 'randomquote', desc: 'Random saved quote', usage: '!randomquote' },
    { name: 'delquote', desc: 'Delete quote', usage: '!delquote [id]' },
    { name: 'alarm', desc: 'Set alarm', usage: '!alarm [time] [message]' },
    { name: 'stopalarm', desc: 'Stop alarm', usage: '!stopalarm' },
    { name: 'timer', desc: 'Set timer', usage: '!timer [seconds] [message]' },
    { name: 'stoptimer', desc: 'Stop timer', usage: '!stoptimer' },
    { name: 'count', desc: 'Count messages', usage: '!count' },
    { name: 'topchat', desc: 'Top chatters', usage: '!topchat' },
    { name: 'mychatcount', desc: 'My chat count', usage: '!mychatcount' },
  ];
  cmds.forEach(c => { c.category = 'misc'; commandMap.set(c.name, c); });
  commandCategories.misc = cmds;
}

// ============= REGISTER ALL =============
function registerAllCommands() {
  registerAdminCommands();
  registerUtilityCommands();
  registerFunCommands();
  registerInfoCommands();
  registerModerationCommands();
  registerMediaCommands();
  registerChatCommands();
  registerMiscCommands();
  console.log(chalk.green(`✅ Registered ${commandMap.size} commands`));
}
registerAllCommands();

// ============= COMMAND HANDLER =============
async function handleCommand(message, cmdName, args) {
  const command = commandMap.get(cmdName.toLowerCase());
  if (!command) return null;
  
  // Check if user is admin for admin commands
  const chat = await message.getChat();
  const isAdmin = chat.participants.some(p => 
    p.id._serialized === message.author && p.isAdmin
  );
  const isBotAdmin = chat.participants.some(p => 
    p.id._serialized === client.info.wid._serialized && p.isAdmin
  );
  const isOwner = message.author === ADMIN_NUMBER;

  if (command.category === 'admin' && !isAdmin && !isOwner) {
    await message.reply('❌ Only admins can use this command!');
    return null;
  }

  // Return command object for execution
  return { command, args, chat, isAdmin, isBotAdmin, isOwner };
}

// ============= ACTUAL COMMAND EXECUTION FUNCTIONS =============

// -------- ADMIN COMMANDS --------
async function cmdAdd(message, args, chat, isAdmin, isBotAdmin, isOwner) {
  if (!args[0]) return message.reply('❌ Please provide a phone number.\nUsage: !add 91xxxxxxxxxx');
  const number = args[0].replace(/[^0-9]/g, '');
  try {
    await chat.addParticipants([`${number}@c.us`]);
    message.reply(`✅ Added ${number} to group!`);
  } catch (e) {
    message.reply(`❌ Failed to add: ${e.message}`);
  }
}

async function cmdRemove(message, args, chat) {
  const mentioned = message.mentionedIds;
  if (!mentioned.length) return message.reply('❌ Mention someone to remove!');
  try {
    await chat.removeParticipants(mentioned);
    message.reply(`✅ Removed ${mentioned.length} member(s)!`);
  } catch (e) {
    message.reply(`❌ Failed to remove: ${e.message}`);
  }
}

async function cmdPromote(message, args, chat, isAdmin, isBotAdmin) {
  const mentioned = message.mentionedIds;
  if (!mentioned.length) return message.reply('❌ Mention someone to promote!');
  if (!isBotAdmin) return message.reply('❌ I need to be admin to promote!');
  try {
    await chat.promoteParticipants(mentioned);
    message.reply(`✅ Promoted ${mentioned.length} member(s)!`);
  } catch (e) {
    message.reply(`❌ Failed to promote: ${e.message}`);
  }
}

async function cmdDemote(message, args, chat, isAdmin, isBotAdmin) {
  const mentioned = message.mentionedIds;
  if (!mentioned.length) return message.reply('❌ Mention someone to demote!');
  if (!isBotAdmin) return message.reply('❌ I need to be admin to demote!');
  try {
    await chat.demoteParticipants(mentioned);
    message.reply(`✅ Demoted ${mentioned.length} member(s)!`);
  } catch (e) {
    message.reply(`❌ Failed to demote: ${e.message}`);
  }
}

async function cmdLockdown(message, args, chat, isAdmin, isBotAdmin) {
  if (!isBotAdmin) return message.reply('❌ I need to be admin to lock!');
  try {
    await chat.setMessagesAdminsOnly(true);
    message.reply('🔒 Group locked! Only admins can send messages.');
  } catch (e) {
    message.reply(`❌ Failed to lock: ${e.message}`);
  }
}

async function cmdUnlock(message, args, chat, isAdmin, isBotAdmin) {
  if (!isBotAdmin) return message.reply('❌ I need to be admin to unlock!');
  try {
    await chat.setMessagesAdminsOnly(false);
    message.reply('🔓 Group unlocked! Everyone can send messages.');
  } catch (e) {
    message.reply(`❌ Failed to unlock: ${e.message}`);
  }
}

// -------- UTILITY COMMANDS --------
async function cmdPing(message) {
  const start = Date.now();
  const reply = await message.reply('🏓 Pinging...');
  const latency = Date.now() - start;
  await reply.edit(`🏓 Pong! Latency: ${latency}ms`);
}

async function cmdUptime(message) {
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  message.reply(`⏱️ Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s`);
}

async function cmdWeather(message, args) {
  if (!args[0]) return message.reply('❌ Please provide a city name.\nUsage: !weather [city]');
  try {
    const city = args.join(' ');
    // Using free weather API (wttr.in)
    const response = await axios.get(`https://wttr.in/${city}?format=%C+%t+%w+%h&lang=en`);
    message.reply(`🌤️ Weather in ${city}: ${response.data}`);
  } catch (e) {
    message.reply(`❌ Couldn't fetch weather: ${e.message}`);
  }
}

async function cmdTime(message, args) {
  const tz = args[0] || 'Asia/Kolkata';
  const time = moment().tz(tz).format('DD/MM/YYYY HH:mm:ss');
  message.reply(`🕐 ${tz}: ${time}`);
}

async function cmdCalc(message, args) {
  if (!args.length) return message.reply('❌ Provide an expression.\nUsage: !calc 2+2');
  try {
    const result = eval(args.join(' '));
    message.reply(`🧮 Result: ${result}`);
  } catch (e) {
    message.reply(`❌ Error: ${e.message}`);
  }
}

async function cmdQR(message, args) {
  if (!args.length) return message.reply('❌ Provide text to generate QR.\nUsage: !qr [text]');
  const text = args.join(' ');
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=300x300`;
  const media = await MessageMedia.fromUrl(qrUrl);
  await message.reply(media, undefined, { caption: `📱 QR Code for: ${text}` });
}

async function cmdPassword(message, args) {
  const length = parseInt(args[0]) || 16;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  message.reply(`🔐 Password: \`${password}\``);
}

async function cmdUUID(message) {
  const uuid = shortid.generate();
  message.reply(`🔢 UUID: \`${uuid}\``);
}

async function cmdBase64(message, args) {
  if (!args.length) return message.reply('❌ Provide text to encode.\nUsage: !base64 [text]');
  const encoded = Buffer.from(args.join(' ')).toString('base64');
  message.reply(`🔐 Base64: \`${encoded}\``);
}

async function cmdUnbase64(message, args) {
  if (!args.length) return message.reply('❌ Provide Base64 text to decode.\nUsage: !unbase64 [text]');
  try {
    const decoded = Buffer.from(args.join(' '), 'base64').toString('utf-8');
    message.reply(`🔓 Decoded: \`${decoded}\``);
  } catch (e) {
    message.reply(`❌ Invalid Base64: ${e.message}`);
  }
}

async function cmdRandom(message, args) {
  const min = parseInt(args[0]) || 0;
  const max = parseInt(args[1]) || 100;
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  message.reply(`🎲 Random number between ${min} and ${max}: **${num}**`);
}

async function cmdDice(message) {
  const roll = Math.floor(Math.random() * 6) + 1;
  message.reply(`🎲 You rolled a **${roll}**!`);
}

async function cmdCoin(message) {
  const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
  const emoji = result === 'Heads' ? '🪙' : '🪙';
  message.reply(`${emoji} **${result}**!`);
}

async function cmd8ball(message, args) {
  if (!args.length) return message.reply('❌ Ask a question!\nUsage: !8ball [question]');
  const responses = [
    'Yes', 'No', 'Maybe', 'Definitely', 'Absolutely not', 'Ask again later',
    'Signs point to yes', 'Cannot predict now', 'Concentrate and ask again',
    'Don\'t count on it', 'It is certain', 'Very doubtful', 'Outlook good',
    'Outlook not so good', 'Most likely', 'My reply is no', 'My sources say no'
  ];
  const answer = responses[Math.floor(Math.random() * responses.length)];
  message.reply(`🎱 ${answer}`);
}

async function cmdRPS(message, args) {
  if (!args[0]) return message.reply('❌ Choose rock, paper, or scissors.\nUsage: !rps [rock/paper/scissors]');
  const choices = ['rock', 'paper', 'scissors'];
  const userChoice = args[0].toLowerCase();
  if (!choices.includes(userChoice)) return message.reply('❌ Choose rock, paper, or scissors.');
  const botChoice = choices[Math.floor(Math.random() * 3)];
  let result;
  if (userChoice === botChoice) result = '🤝 Tie!';
  else if (
    (userChoice === 'rock' && botChoice === 'scissors') ||
    (userChoice === 'paper' && botChoice === 'rock') ||
    (userChoice === 'scissors' && botChoice === 'paper')
  ) result = '🎉 You win!';
  else result = '😢 You lose!';
  message.reply(`You: ${userChoice} | Bot: ${botChoice}\n**${result}**`);
}

async function cmdTrivia(message) {
  try {
    const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
    const data = response.data.results[0];
    const options = [...data.incorrect_answers, data.correct_answer];
    options.sort(() => Math.random() - 0.5);
    const formattedOptions = options.map((o, i) => `${i+1}. ${o}`).join('\n');
    message.reply(`🧠 **Trivia:** ${data.question}\n\n${formattedOptions}`);
  } catch (e) {
    message.reply(`❌ Couldn't fetch trivia: ${e.message}`);
  }
}

async function cmdFact(message) {
  try {
    const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
    message.reply(`📖 **Fact:** ${response.data.text}`);
  } catch (e) {
    message.reply(`❌ Couldn't fetch fact: ${e.message}`);
  }
}

async function cmdQuote(message) {
  try {
    const response = await axios.get('https://api.quotable.io/random');
    message.reply(`💬 **"${response.data.content}"**\n— ${response.data.author}`);
  } catch (e) {
    message.reply(`❌ Couldn't fetch quote: ${e.message}`);
  }
}

async function cmdJoke(message) {
  try {
    const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
    if (response.data.type === 'single') {
      message.reply(`😂 ${response.data.joke}`);
    } else {
      message.reply(`😂 ${response.data.setup}\n\n${response.data.delivery}`);
    }
  } catch (e) {
    message.reply(`❌ Couldn't fetch joke: ${e.message}`);
  }
}

// -------- FUN COMMANDS --------
async function cmdTruth(message) {
  const truths = [
    'What is your biggest fear?', 'Have you ever cheated?', 'What is your darkest secret?',
    'Who do you have a crush on?', 'What is your biggest regret?', 'Have you ever lied to your best friend?',
    'What is the most embarrassing thing you\'ve done?', 'Do you believe in ghosts?',
    'What is your biggest insecurity?', 'Have you ever stolen anything?',
    'What is the worst thing you\'ve ever said to someone?', 'Do you have any weird habits?',
    'What is your guilty pleasure?', 'Have you ever broken someone\'s heart?',
    'What is your most embarrassing moment?', 'Do you have any secrets you\'ve never told anyone?'
  ];
  const truth = truths[Math.floor(Math.random() * truths.length)];
  message.reply(`🔮 **Truth:** ${truth}`);
}

async function cmdDare(message) {
  const dares = [
    'Do 10 push-ups right now', 'Sing a song out loud', 'Send a message to your crush',
    'Do a handstand against the wall', 'Imitate someone in the group', 'Say something in a funny accent',
    'Post a random selfie', 'Tell a joke', 'Do a dance', 'Call a friend and say something random',
    'Eat something weird', 'Do 20 squats', 'Write a poem', 'Name 5 things you love',
    'Explain something complicated simply', 'Do your best impression'
  ];
  const dare = dares[Math.floor(Math.random() * dares.length)];
  message.reply(`💀 **Dare:** ${dare}`);
}

async function cmdRoast(message, args) {
  const mentioned = message.mentionedIds;
  const target = mentioned.length ? `@${mentioned[0].replace('@c.us', '')}` : 'someone';
  const roasts = [
    `You're not stupid; you just have bad luck thinking, ${target}.`,
    `${target}, you're proof that evolution can go in reverse.`,
    `I'd agree with you, ${target}, but then we'd both be wrong.`,
    `${target}, you bring everyone so much joy—when you leave.`,
    `You're like a cloud, ${target}. When you disappear, it's a beautiful day.`,
    `${target}, you're the reason the gene pool needs a lifeguard.`,
    `I've seen salads with more personality than you, ${target}.`,
    `${target}, your secrets are safe with me. I never listen anyway.`,
    `You're not pretty enough to be this dumb, ${target}.`,
    `${target}, you're the human equivalent of a participation trophy.`
  ];
  const roast = roasts[Math.floor(Math.random() * roasts.length)];
  message.reply(`🔥 ${roast}`);
}

async function cmdCompliment(message, args) {
  const mentioned = message.mentionedIds;
  const target = mentioned.length ? `@${mentioned[0].replace('@c.us', '')}` : 'you';
  const compliments = [
    `${target}, you're like a breath of fresh air.`,
    `I really admire your energy, ${target}.`,
    `${target}, you're one of the smartest people I know.`,
    `You have a great sense of humor, ${target}.`,
    `${target}, you're beautiful inside and out.`,
    `I love how kind you are to everyone, ${target}.`,
    `${target}, you light up any room you walk into.`,
    `You're so talented, ${target}.`,
    `${target}, you're a gem.`,
    `I'm lucky to know someone like you, ${target}.`
  ];
  const compliment = compliments[Math.floor(Math.random() * compliments.length)];
  message.reply(`💖 ${compliment}`);
}

async function cmdHug(message, args) {
  const mentioned = message.mentionedIds;
  const target = mentioned.length ? `@${mentioned[0].replace('@c.us', '')}` : 'everyone';
  const hugs = ['🤗', '🫂', '❤️', '💕', '🌸'];
  const hug = hugs[Math.floor(Math.random() * hugs.length)];
  message.reply(`${hug} *Hugs ${target} tightly* ${hug}`);
}

async function cmdKiss(message, args) {
  const mentioned = message.mentionedIds;
  if (!mentioned.length) return message.reply('❌ Mention someone to kiss!');
  const target = `@${mentioned[0].replace('@c.us', '')}`;
  const kisses = ['😘', '💋', '❤️‍🔥', '😚'];
  const kiss = kisses[Math.floor(Math.random() * kisses.length)];
  message.reply(`${kiss} *Kisses ${target}* ${kiss}`);
}

async function cmdShip(message, args) {
  const mentioned = message.mentionedIds;
  if (mentioned.length < 2) return message.reply('❌ Mention two people to ship!\nUsage: !ship @user1 @user2');
  const p1 = `@${mentioned[0].replace('@c.us', '')}`;
  const p2 = `@${mentioned[1].replace('@c.us', '')}`;
  const percentage = Math.floor(Math.random() * 100) + 1;
  let verdict;
  if (percentage > 80) verdict = '❤️‍🔥 Perfect match!';
  else if (percentage > 60) verdict = '💕 Good vibes!';
  else if (percentage > 40) verdict = '💔 It\'s complicated...';
  else verdict = '😬 Oof, not meant to be.';
  message.reply(`💞 **${p1}** ❤️ **${p2}**\nMatch: ${percentage}%\n${verdict}`);
}

// -------- INFO COMMANDS --------
async function cmdHelp(message, args) {
  let helpText = `🤖 **${BOT_NAME} Bot Help**\n`;
  helpText += `Prefix: \`${PREFIX}\`\n`;
  helpText += `Total commands: ${commandMap.size}\n\n`;
  
  if (args[0]) {
    const cmd = commandMap.get(args[0].toLowerCase());
    if (cmd) {
      helpText += `📌 **${PREFIX}${cmd.name}**\n`;
      helpText += `📝 ${cmd.desc}\n`;
      helpText += `📖 Usage: ${cmd.usage}\n`;
      helpText += `📂 Category: ${cmd.category}`;
      return message.reply(helpText);
    } else {
      return message.reply(`❌ Command "${args[0]}" not found.`);
    }
  }
  
  for (const [category, cmds] of Object.entries(commandCategories)) {
    if (cmds.length) {
      helpText += `\n**${category.toUpperCase()}** (${cmds.length}):\n`;
      helpText += cmds.slice(0, 10).map(c => `!${c.name}`).join(', ');
      if (cmds.length > 10) helpText += `, +${cmds.length - 10} more`;
      helpText += `\n📖 Type !help [command] for details`;
    }
  }
  
  await message.reply(helpText);
}

async function cmdBotInfo(message) {
  const info = `🤖 **${BOT_NAME} Bot Info**\n\n` +
    `📦 Version: 1.0.0\n` +
    `📂 Commands: ${commandMap.size}\n` +
    `⏱️ Uptime: ${Math.floor(process.uptime())}s\n` +
    `🧠 Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB\n` +
    `👑 Owner: ${ADMIN_NUMBER}\n` +
    `💻 Platform: Node.js ${process.version}\n` +
    `📢 Code By: CHINTU`;
  message.reply(info);
}

async function cmdGroupInfo(message, chat) {
  const participants = chat.participants;
  const admins = participants.filter(p => p.isAdmin);
  const info = `📊 **Group Info**\n\n` +
    `📛 Name: ${chat.name}\n` +
    `👥 Members: ${participants.length}\n` +
    `👑 Admins: ${admins.length}\n` +
    `📝 Description: ${chat.description || 'None'}\n` +
    `🔒 Locked: ${chat.isGroup ? 'Yes' : 'No'}`;
  message.reply(info);
}

// -------- MEDIA COMMANDS --------
async function cmdSticker(message) {
  const quotedMessage = await message.getQuotedMessage();
  if (!quotedMessage || !quotedMessage.hasMedia) {
    return message.reply('❌ Reply to an image/GIF to make a sticker!');
  }
  try {
    const media = await quotedMessage.downloadMedia();
    await message.reply(media, undefined, { sendMediaAsSticker: true });
  } catch (e) {
    message.reply(`❌ Failed to create sticker: ${e.message}`);
  }
}

// -------- CHAT COMMANDS --------
async function cmdSay(message, args) {
  if (!args.length) return message.reply('❌ Provide text to say.\nUsage: !say [text]');
  await message.delete();
  const chat = await message.getChat();
  await chat.sendMessage(args.join(' '));
}

async function cmdEcho(message, args) {
  if (!args.length) return message.reply('❌ Provide text to echo.\nUsage: !echo [text]');
  message.reply(args.join(' '));
}

async function cmdPoll(message, args) {
  if (args.length < 3) return message.reply('❌ Usage: !poll [question] [option1] [option2] ...');
  const question = args[0];
  const options = args.slice(1);
  if (options.length < 2) return message.reply('❌ Need at least 2 options.');
  let pollText = `📊 **${question}**\n\n`;
  options.forEach((opt, i) => {
    pollText += `${i+1}. ${opt}\n`;
  });
  pollText += '\nReply with !vote [number] to vote!';
  const pollMsg = await message.reply(pollText);
  // Store poll data in memory
  if (!global.polls) global.polls = {};
  const pollId = pollMsg.id._serialized;
  global.polls[pollId] = {
    question,
    options,
    votes: {},
    voters: []
  };
}

async function cmdVote(message, args) {
  if (!args[0]) return message.reply('❌ Provide option number.\nUsage: !vote [option number]');
  const quoted = await message.getQuotedMessage();
  if (!quoted) return message.reply('❌ Reply to a poll message!');
  const pollId = quoted.id._serialized;
  if (!global.polls || !global.polls[pollId]) return message.reply('❌ Poll not found or expired.');
  const poll = global.polls[pollId];
  const optionIndex = parseInt(args[0]) - 1;
  if (isNaN(optionIndex) || optionIndex < 0 || optionIndex >= poll.options.length) {
    return message.reply(`❌ Choose a number between 1 and ${poll.options.length}`);
  }
  const voter = message.author;
  if (poll.voters.includes(voter)) {
    return message.reply('❌ You already voted in this poll!');
  }
  poll.voters.push(voter);
  const optionName = poll.options[optionIndex];
  if (!poll.votes[optionName]) poll.votes[optionName] = 0;
  poll.votes[optionName]++;
  message.reply(`✅ Voted for: **${optionName}**`);
}

// ============= MAIN MESSAGE HANDLER =============
client.on('message_create', async (message) => {
  // Ignore bot's own messages
  if (message.fromMe) return;
  
  // Check if message starts with prefix
  if (!message.body.startsWith(PREFIX)) {
    // Check for auto-reply (if implemented)
    return;
  }
  
  const args = message.body.slice(PREFIX.length).trim().split(/\s+/);
  const cmdName = args.shift().toLowerCase();
  
  try {
    const result = await handleCommand(message, cmdName, args);
    if (!result) return;
    
    const { command, args: cmdArgs, chat, isAdmin, isBotAdmin, isOwner } = result;
    
    // Route to appropriate command handler
    const handlers = {
      'add': cmdAdd, 'remove': cmdRemove, 'promote': cmdPromote, 'demote': cmdDemote,
      'lockdown': cmdLockdown, 'unlock': cmdUnlock,
      'ping': cmdPing, 'uptime': cmdUptime, 'weather': cmdWeather, 'time': cmdTime,
      'calc': cmdCalc, 'qr': cmdQR, 'password': cmdPassword, 'uuid': cmdUUID,
      'base64': cmdBase64, 'unbase64': cmdUnbase64, 'random': cmdRandom,
      'dice': cmdDice, 'coin': cmdCoin, '8ball': cmd8ball, 'rps': cmdRPS,
      'trivia': cmdTrivia, 'fact': cmdFact, 'quote': cmdQuote, 'joke': cmdJoke,
      'truth': cmdTruth, 'dare': cmdDare, 'roast': cmdRoast, 'compliment': cmdCompliment,
      'hug': cmdHug, 'kiss': cmdKiss, 'ship': cmdShip,
      'help': cmdHelp, 'botinfo': cmdBotInfo, 'groupinfo': cmdGroupInfo,
      'sticker': cmdSticker,
      'say': cmdSay, 'echo': cmdEcho, 'poll': cmdPoll, 'vote': cmdVote,
    };
    
    if (handlers[cmdName]) {
      await handlers[cmdName](message, cmdArgs, chat, isAdmin, isBotAdmin, isOwner);
    } else {
      // Check if it's a custom command
      message.reply(`❌ Unknown command. Type !help for list.`);
    }
  } catch (error) {
    console.error(chalk.red(`Error in command ${cmdName}:`), error);
    message.reply(`❌ Error executing command: ${error.message}`);
  }
});

// ============= QR CODE =============
client.on('qr', (qr) => {
  console.log(chalk.yellow('📱 Scan this QR code with WhatsApp:'));
  qrcode.generate(qr, { small: true });
});

// ============= READY =============
client.on('ready', () => {
  console.log(chalk.green(`✅ ${BOT_NAME} Bot is ready!`));
  console.log(chalk.blue(`📊 ${commandMap.size} commands loaded`));
  console.log(chalk.magenta('👑 Code By CHINTU'));
});

// ============= START =============
client.initialize().catch(err => {
  console.error(chalk.red('❌ Failed to start:'), err);
});

// ============= CRON JOBS =============
// Daily backup at midnight
cron.schedule('0 0 * * *', () => {
  console.log(chalk.blue('📁 Running daily backup...'));
  // Implement backup logic here
});

console.log(chalk.cyan('🤖 Starting CHINTU Bot...'));
console.log(chalk.magenta('📱 Admin Number:', ADMIN_NUMBER));