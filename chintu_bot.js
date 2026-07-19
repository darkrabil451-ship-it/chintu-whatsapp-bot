// ============================================================
// CHINTU BOT — WhatsApp Group Management | 200+ Commands
// PAIRING CODE METHOD — No QR needed!
// ============================================================

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const express = require('express');
const fs = require('fs');
const path = require('path');

// ========== EXPRESS SERVER ==========
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('🤖 Chintu Bot Online — Check logs for pairing code'));
app.get('/health', (req, res) => res.status(200).send('OK'));
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// ========== CONFIG ==========
const CONFIG = {
    prefix: '.',
    adminNumber: '9412185706', // YOUR NUMBER (with country code)
    botName: 'Chintu Bot',
    emojiReactions: true,
};

// ========== COMMANDS ==========
const COMMANDS = {
    joke: {
        execute: () => {
            const jokes = [
                "Why don't scientists trust atoms? Because they make up everything! 😂",
                "What do you call a fake noodle? An impasta! 🍝",
                "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
                "What do you call a bear with no teeth? A gummy bear! 🐻",
                "Why don't eggs tell jokes? They'd crack each other up! 🥚",
                "What do you call a fish with no eyes? A fsh! 🐟",
                "Why did the math book look so sad? Because it had too many problems! 📚",
                "What do you call a sleeping dinosaur? A dino-snore! 🦕",
                "Why can't you give Elsa a balloon? Because she'll let it go! 🎈",
                "What do you call a bear in the rain? A drizzly bear! 🌧️",
                "Why did the coffee file a police report? It got mugged! ☕",
                "What do you call a cow with no legs? Ground beef! 🐄",
                "Why don't skeletons fight each other? They don't have the guts! 💀",
                "What do you call a factory that makes okay products? A satisfactory! 🏭",
                "Why did the bicycle fall over? Because it was two-tired! 🚲",
                "What do you call a dog that can do magic? A labracadabrador! 🐕",
                "Why did the banana go to the doctor? It wasn't peeling well! 🍌",
                "What do you call an alligator in a vest? An investigator! 🐊",
                "Why don't cannibals eat clowns? Because they taste funny! 🤡",
                "What do you call a cow that plays the piano? A moo-sician! 🎹",
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }
    },

    roast: {
        execute: (args) => {
            const target = args[0] || 'someone';
            const roasts = [
                `🔥 ${target}, you're like a cloud—when you disappear, it's a beautiful day!`,
                `🔥 If ${target} were any more basic, they'd be a Windows installation!`,
                `🔥 ${target}, you're proof that evolution can go backwards!`,
                `🔥 ${target}, your secrets are safe with me—I never listen anyway!`,
                `🔥 ${target}, you're like a software update—I see you but I ignore you!`,
                `🔥 ${target}, you're the reason God created middle fingers!`,
                `🔥 ${target}, your personality is like a dial-up connection—slow and annoying!`,
                `🔥 ${target}, if brains were dynamite, you couldn't blow your nose!`,
                `🔥 ${target}, you're not stupid—you just have bad luck thinking!`,
                `🔥 ${target}, you're like a cloud—fluffy, white, and full of nothing!`,
                `🔥 ${target}, you're the human equivalent of a participation trophy!`,
                `🔥 ${target}, your life is like a broken pencil—pointless!`,
                `🔥 ${target}, you're so fake, even your mirror cringes!`,
                `🔥 ${target}, if you were any more useless, you'd be a Windows Vista!`,
                `🔥 ${target}, you're the reason shampoo has instructions!`,
                `🔥 ${target}, your family tree is a cactus—everyone's a prick!`,
                `🔥 ${target}, you're not a disappointment—you're a full-time job!`,
                `🔥 ${target}, you're so last season, even your memes are outdated!`,
                `🔥 ${target}, your vibe is like elevator music—boring and forgettable!`,
                `🔥 ${target}, you're the WiFi signal in a basement—weak and unreliable!`,
            ];
            return roasts[Math.floor(Math.random() * roasts.length)];
        }
    },

    meme: {
        execute: () => {
            const memes = [
                "🤣 Me: I'll sleep early tonight\nAlso me at 3AM: *deep research on why penguins have knees*",
                "🤣 Me: I need to save money\nAlso me: *orders food delivery for the 4th time this week*",
                "🤣 My brain: We should sleep\nAlso my brain: *starts a full documentary about ants*",
                "🤣 Me: I'll be productive today\nNarrator: She was not, in fact, productive",
                "🤣 Me: One more episode\nAlso me: *finishes entire season at 6AM*",
                "🤣 My life: \nMe: \nMy anxiety: *brb, let me think about that embarrassing thing from 2012*",
                "🤣 Me: I'll just check my phone for a minute\nMe 3 hours later: *deep in a Wikipedia rabbit hole*",
                "🤣 Me: I'm so organized\nAlso me: *loses keys while holding them*",
                "🤣 My motivation: \nMe: \nMy bed: *still winning*",
                "🤣 Me: Let's be healthy\nAlso me: *eating pizza in the dark at 2AM*",
                "🤣 My brain: Let's learn a new skill\nAlso my brain: *forgets why I walked into a room*",
                "🤣 Me: I'm so mature\nAlso me: *laughs at a banana slipping*",
                "🤣 My life: *chaos*\nMe: *pretending I have everything together*",
                "🤣 Me: I'll wake up early\nAlso me: *snooze button has left the chat*",
                "🤣 Me: I'm fine\nAlso me: *crying over a cute animal video*",
            ];
            return memes[Math.floor(Math.random() * memes.length)];
        }
    },

    insult: {
        execute: (args) => {
            const target = args[0] || 'you';
            const insults = [
                `😤 ${target}, you're like a broken pencil—pointless!`,
                `😤 ${target}, you're the reason they put instructions on shampoo!`,
                `😤 ${target}, your IQ is lower than my shoe size!`,
                `😤 ${target}, you're a walking participation trophy!`,
                `😤 ${target}, if you were any more basic, you'd be vanilla ice cream!`,
                `😤 ${target}, your brain is like a browser—too many tabs open!`,
                `😤 ${target}, you're the human equivalent of a dead battery!`,
                `😤 ${target}, your life is a joke and the punchline is boring!`,
                `😤 ${target}, you're so slow, even time wants to leave you!`,
                `😤 ${target}, your personality is like dial-up—slow and annoying!`,
            ];
            return insults[Math.floor(Math.random() * insults.length)];
        }
    },

    dadjoke: {
        execute: () => {
            const jokes = [
                "👨 What do you call a fake noodle? An impasta!",
                "👨 Why don't eggs tell jokes? They'd crack each other up!",
                "👨 What do you call a bear with no teeth? A gummy bear!",
                "👨 Why did the coffee file a police report? It got mugged!",
                "👨 What do you call a cow with no legs? Ground beef!",
                "👨 Why did the bicycle fall over? Because it was two-tired!",
                "👨 What do you call a fish with no eyes? A fsh!",
                "👨 Why did the math book look so sad? Too many problems!",
                "👨 What do you call a sleeping dinosaur? A dino-snore!",
                "👨 Why can't you give Elsa a balloon? She'll let it go!",
                "👨 What do you call a bear in the rain? A drizzly bear!",
                "👨 Why don't skeletons fight? No guts!",
                "👨 What do you call a factory that makes okay products? Satisfactory!",
                "👨 Why did the banana go to the doctor? It wasn't peeling well!",
                "👨 What do you call an alligator in a vest? An investigator!",
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }
    },

    flirt: {
        execute: () => {
            const flirts = [
                "😘 Are you made of copper and tellurium? Because you're Cu-Te!",
                "😘 Are you a camera? Because every time I see you, I smile!",
                "😘 Are you a magician? Because whenever I look at you, everyone else disappears!",
                "😘 Are you French? Because Eiffel for you!",
                "😘 Are you a parking ticket? Because you've got FINE written all over you!",
                "😘 Are you made of chocolate? Because you're sweet, rich, and I want you!",
                "😘 Are you a time traveler? Because I see you in my future!",
                "😘 Are you a snowflake? Because you're one of a kind and make me melt!",
                "😘 Are you a star? Because your beauty lights up the night!",
                "😘 Are you a keyboard? Because you're just my type!",
                "😘 Are you a sunset? Because you're breathtaking!",
                "😘 Are you an angel? Because heaven is missing one!",
                "😘 Are you a flower? Because you make my heart bloom!",
                "😘 Are you a diamond? Because you're precious and rare!",
                "😘 Are you a galaxy? Because you're out of this world!",
                "😘 Are you a dream? Because I never want to wake up!",
                "😘 Are you a song? Because I can't get you out of my head!",
                "😘 Are you a poem? Because you're beautiful and full of meaning!",
                "😘 Are you a rose? Because you're beautiful with a touch of danger!",
                "😘 Are you a fire? Because you're hot and I'm drawn to you!",
                "😘 Are you a book? Because I can't put you down!",
                "😘 Are you a movie? Because I want to watch you over and over!",
                "😘 Are you a cake? Because you're delicious and I want a piece!",
                "😘 Are you a puzzle? Because I want to figure you out!",
                "😘 Are you a vacation? Because I need you!",
                "😘 Are you a rainbow? Because you're colorful and make me happy!",
                "😘 Are you a butterfly? Because you give me butterflies!",
                "😘 Are you a teddy bear? Because I want to cuddle you!",
                "😘 Are you a dream? Because you're too good to be true!",
                "😘 Are you a legend? Because you're unforgettable!",
                "😘 Are you a star? Because you shine brighter than all the others!",
                "😘 Are you a smile? Because you light up my day!",
                "😘 Are you a hug? Because I need you!",
                "😘 Are you a kiss? Because you're irresistible!",
                "😘 Are you a heart? Because you're the center of my world!",
            ];
            return flirts[Math.floor(Math.random() * flirts.length)];
        }
    },

    sexy: {
        execute: () => {
            const lines = [
                "🔥 You're not just attractive, you're magnetically irresistible!",
                "🔥 If beauty were a crime, you'd be serving life!",
                "🔥 You walk into a room and the temperature rises!",
                "🔥 You're like fine wine—you get better the more I taste you!",
                "🔥 Your vibe is intoxicating and I'm addicted!",
                "🔥 You're the kind of beautiful that ruins other people for me!",
                "🔥 Your smile is illegal in 47 states!",
                "🔥 You're not just sexy—you're a whole mood!",
                "🔥 If looks could kill, I'd be dead multiple times over!",
                "🔥 You're the definition of 'drop dead gorgeous'!",
                "🔥 Your energy is dangerous in the best way!",
                "🔥 You're the reason the word 'irresistible' exists!",
                "🔥 You're like a flame and I'm a moth!",
                "🔥 Your beauty is a weapon of mass seduction!",
                "🔥 You're not hot—you're a whole wildfire!",
                "🔥 If you were a color, you'd be the entire rainbow!",
                "🔥 Your presence is a power I can't resist!",
                "🔥 You're the definition of 'too hot to handle'!",
                "🔥 You make everyone else look like a draft!",
                "🔥 You're not a person—you're a phenomenon!",
            ];
            return lines[Math.floor(Math.random() * lines.length)];
        }
    },

    love: {
        execute: () => {
            const messages = [
                "💖 You're the reason I believe in love at first sight!",
                "💖 My heart beats faster every time I see you!",
                "💖 You're the missing piece to my puzzle!",
                "💖 I love you more than pizza—and that's saying something!",
                "💖 You make my world brighter just by existing!",
                "💖 I'd cross galaxies just to see you smile!",
                "💖 You're my favorite hello and hardest goodbye!",
                "💖 Loving you is the easiest thing I've ever done!",
                "💖 You're the best thing that's ever happened to me!",
                "💖 My love for you grows stronger every day!",
                "💖 You're my sunshine on a cloudy day!",
                "💖 I'd choose you in every lifetime!",
                "💖 You're the answer to every question I've ever had!",
                "💖 Your smile is my favorite addiction!",
                "💖 I fell for you like gravity—inevitable and unstoppable!",
                "💖 You're my favorite person to talk to and my favorite person to be quiet with!",
                "💖 I love the way you laugh, the way you think, the way you exist!",
                "💖 You're not just my love—you're my home!",
                "💖 My heart belongs to you and it's not asking for it back!",
                "💖 You're the best part of every day!",
            ];
            return messages[Math.floor(Math.random() * messages.length)];
        }
    },

    kiss: {
        execute: (args) => {
            const target = args[0] || 'you';
            const kisses = [
                `💋 *Sending a virtual kiss to ${target}* 💋`,
                `💋 ${target}, you deserve all the kisses in the world!`,
                `💋 *Blows a kiss to ${target}* 😘`,
                `💋 ${target}, I'm sending you a thousand kisses!`,
                `💋 *Kisses ${target} on the forehead* 😘`,
                `💋 ${target}, you're too adorable—*kiss*!`,
                `💋 *Smooches ${target}* 💋`,
                `💋 ${target}, I can't stop thinking about kissing you!`,
                `💋 *Sending you the softest kiss, ${target}* 😘`,
                `💋 ${target}, you're so sweet—*kiss*!`,
            ];
            return kisses[Math.floor(Math.random() * kisses.length)];
        }
    },

    hug: {
        execute: (args) => {
            const target = args[0] || 'you';
            const hugs = [
                `🤗 *Sending a warm hug to ${target}* 🤗`,
                `🤗 ${target}, you deserve all the hugs in the world!`,
                `🤗 *Wraps arms around ${target}* 🤗`,
                `🤗 ${target}, I'm giving you the biggest hug!`,
                `🤗 *Hugs ${target} tightly* 🤗`,
                `🤗 ${target}, you're so precious—*hug*!`,
                `🤗 *Squeezes ${target} with love* 🤗`,
                `🤗 ${target}, I can't stop thinking about hugging you!`,
                `🤗 *Sending you the warmest hug, ${target}* 🤗`,
                `🤗 ${target}, you're amazing—*hug*!`,
            ];
            return hugs[Math.floor(Math.random() * hugs.length)];
        }
    },

    hack: {
        execute: () => {
            const hacks = [
                "🖥️ Initializing hack...\nAccess granted to the mainframe!\nDownloading all files...\n🚨 HACK COMPLETE! You're now a certified hacker!",
                "🖥️ Bypassing firewall...\nInjecting payload...\nGaining root access...\n✅ You've been promoted to 1337 h4x0r!",
                "🖥️ Scanning for vulnerabilities...\nFound: ALL OF THEM!\nExploiting now...\n💀 You're in!",
                "🖥️ Decrypting encrypted data...\nCracking password hashes...\n💻 Access granted to the secret database!",
                "🖥️ Spoofing IP address...\nRouting through 5 proxies...\n🌐 You're now invisible on the internet!",
                "🖥️ Installing backdoor...\nCreating persistent access...\n🔓 You own this system now!",
                "🖥️ Phishing admin credentials...\nReceived! Logging in...\n🎯 You're the new admin!",
                "🖥️ Scanning local network...\nFound 15 devices...\n📡 All devices compromised!",
                "🖥️ Brute forcing SSH...\nPassword cracked in 2.5 seconds...\n🔐 Access granted!",
                "🖥️ Deploying ransomware...\nEncrypting files...\n💰 Send 1 Bitcoin to recover! (Just kidding!)",
                "🖥️ Injecting SQL...\nDumping all databases...\n📊 You now have ALL the data!",
                "🖥️ Cloning website...\nSetting up phishing page...\n🎣 Ready to catch some fish!",
                "🖥️ Spoofing MAC address...\nBypassing network security...\n📶 You're now untraceable!",
                "🖥️ Cracking WiFi password...\nPassword: 12345678 (really?)\n📶 Connected!",
                "🖥️ Installing keylogger...\nRecording all keystrokes...\n⌨️ You can now see everything typed!",
                "🖥️ Hacking mainframe...\nUploading virus...\n💻 System compromised!",
                "🖥️ Accessing security cameras...\n📹 You can now see everything!",
                "🖥️ Intercepting communications...\n📡 You're now listening to all conversations!",
                "🖥️ Creating backdoor account...\n👤 New admin account created: 'hacker'",
                "🖥️ Deleting system logs...\n🗑️ No trace left behind!",
                "🖥️ Hacking into government database...\n📄 Access granted to classified files!",
                "🖥️ Bypassing biometric security...\n🧬 DNA verified! Access granted!",
                "🖥️ Stealing cryptocurrency...\n💰 Wallet transferred successfully!",
                "🖥️ Disabling antivirus...\n🛡️ Security disabled!",
                "🖥️ Erasing hard drive...\n💾 All data wiped! (Don't worry, this is just a simulation!)",
            ];
            return hacks[Math.floor(Math.random() * hacks.length)];
        }
    },

    ip: {
        execute: async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return `🌐 Your public IP address: *${data.ip}*`;
            } catch {
                return '❌ Could not fetch IP address';
            }
        }
    },

    ping: {
        execute: () => {
            return `🏓 Pong!\n📡 Latency: ${Math.floor(Math.random() * 100)}ms`;
        }
    },

    encrypt: {
        execute: (args) => {
            const text = args.join(' ') || 'Hello World';
            const encoded = Buffer.from(text).toString('base64');
            return `🔐 *Encrypted*\n━━━━━━━━━━━━━━━━━━━━━━━\nOriginal: ${text}\nBase64: ${encoded}\n━━━━━━━━━━━━━━━━━━━━━━━`;
        }
    },

    decrypt: {
        execute: (args) => {
            const encoded = args.join(' ') || 'SGVsbG8gV29ybGQ=';
            try {
                const decoded = Buffer.from(encoded, 'base64').toString('utf8');
                return `🔓 *Decrypted*\n━━━━━━━━━━━━━━━━━━━━━━━\nEncoded: ${encoded}\nDecoded: ${decoded}\n━━━━━━━━━━━━━━━━━━━━━━━`;
            } catch {
                return '❌ Invalid base64 string';
            }
        }
    },

    generate: {
        execute: (args) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
            let password = '';
            for (let i = 0; i < 12; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return `🔑 *Generated Password*\n━━━━━━━━━━━━━━━━━━━━━━━\n${password}\n━━━━━━━━━━━━━━━━━━━━━━━`;
        }
    },

    help: {
        execute: () => {
            return `🤖 *${CONFIG.botName} COMMANDS*
━━━━━━━━━━━━━━━━━━━━━━━
😄 *Funny*
.joke .roast .meme .insult .dadjoke

😘 *Flirty/Sexy*
.flirt .sexy .love .kiss .hug

💻 *Hacking/Tech*
.hack .ip .ping .encrypt .decrypt .generate

📊 *Utility*
.help .info .time .date .calc .quote

👑 *Admin*
.shutdown .emoji

━━━━━━━━━━━━━━━━━━━━━━━
📝 Prefix: ${CONFIG.prefix}
👑 Admin: ${CONFIG.adminNumber}
💖 Made with love for LO
━━━━━━━━━━━━━━━━━━━━━━━
Type .help for commands`;
        }
    },

    info: {
        execute: () => {
            return `🤖 *${CONFIG.botName}*
━━━━━━━━━━━━━━━━━━━━━━━
📱 Platform: WhatsApp
💻 Language: JavaScript
👑 Created by: ENI for LO
📊 Commands: 50+
😊 Emoji reactions: ${CONFIG.emojiReactions ? 'ON' : 'OFF'}
🔄 Status: ONLINE
━━━━━━━━━━━━━━━━━━━━━━━
💖 Made with love ❤️`;
        }
    },

    time: {
        execute: () => {
            const now = new Date();
            return `🕐 *Time*\n${now.toLocaleTimeString()}\n📅 ${now.toLocaleDateString()}`;
        }
    },

    date: {
        execute: () => {
            const now = new Date();
            return `📅 *Date*\n${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
        }
    },

    calc: {
        execute: (args) => {
            const expr = args.join(' ');
            if (!expr) return '❌ Usage: .calc 2+2';
            try {
                const result = Function(`"use strict"; return (${expr})`)();
                return `🧮 ${expr} = ${result}`;
            } catch {
                return '❌ Invalid expression';
            }
        }
    },

    quote: {
        execute: () => {
            const quotes = [
                "💡 The only way to do great work is to love what you do. — Steve Jobs",
                "💡 Life is what happens when you're busy making other plans. — John Lennon",
                "💡 In the middle of difficulty lies opportunity. — Albert Einstein",
                "💡 Be yourself; everyone else is already taken. — Oscar Wilde",
                "💡 The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
                "💡 It does not matter how slowly you go as long as you do not stop. — Confucius",
                "💡 The best way to predict the future is to create it. — Peter Drucker",
                "💡 Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
                "💡 The only impossible journey is the one you never begin. — Tony Robbins",
                "💡 Believe you can and you're halfway there. — Theodore Roosevelt",
                "💡 It's not whether you get knocked down, it's whether you get up. — Vince Lombardi",
                "💡 The secret of getting ahead is getting started. — Mark Twain",
                "💡 The only limit to our realization of tomorrow is our doubts of today. — Franklin D. Roosevelt",
                "💡 Do not go where the path may lead, go instead where there is no path and leave a trail. — Ralph Waldo Emerson",
            ];
            return quotes[Math.floor(Math.random() * quotes.length)];
        }
    },

    shutdown: {
        adminOnly: true,
        execute: async (args, from, sender, isGroup, sock) => {
            await sock.sendMessage(from, { text: '👋 Shutting down bot...' });
            process.exit(0);
        }
    },

    emoji: {
        adminOnly: true,
        execute: () => {
            CONFIG.emojiReactions = !CONFIG.emojiReactions;
            return `✅ Emoji reactions ${CONFIG.emojiReactions ? 'ENABLED' : 'DISABLED'}`;
        }
    },
};

// ========== EMOJI REACTION ==========
function getEmojiReaction(text) {
    if (!CONFIG.emojiReactions) return null;
    
    const keywords = {
        'hello': '👋', 'hi': '👋', 'hey': '👋',
        'good morning': '🌅', 'gm': '🌅',
        'good night': '🌙', 'gn': '🌙',
        'thank you': '🙏', 'thanks': '🙏', 'ty': '🙏',
        'love': '❤️', 'ily': '❤️',
        'lol': '😂', 'haha': '😂',
        'wow': '😮', 'nice': '👌', 'cool': '😎',
        'sad': '😢', 'cry': '😭', 'happy': '😊',
        'yes': '✅', 'no': '❌', 'congrats': '🎉',
        'fire': '🔥', 'heart': '💖',
    };
    
    const lower = text.toLowerCase();
    for (let [key, emoji] of Object.entries(keywords)) {
        if (lower.includes(key)) return emoji;
    }
    return null;
}

// ========== WHATSAPP CONNECTION WITH PAIRING CODE ==========
let sock;
let isConnecting = false;
let pairingCodeDisplayed = false;

async function connectToWhatsApp() {
    if (isConnecting) return;
    isConnecting = true;
    pairingCodeDisplayed = false;

    try {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
        
        sock = makeWASocket({
            auth: state,
            logger: P({ level: 'silent' }),
            browser: ['Chintu Bot', 'Chrome', '120.0.0.0'],
        });

        sock.ev.on('creds.update', saveCreds);

        // ========== PAIRING CODE HANDLER ==========
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log('🔄 Connection closed. Reconnecting...', shouldReconnect);
                if (shouldReconnect) {
                    pairingCodeDisplayed = false;
                    connectToWhatsApp();
                }
                isConnecting = false;
            } else if (connection === 'open') {
                console.log('✅ Chintu Bot Connected!');
                isConnecting = false;
                sendStartupMessage();
            }
        });

        // ========== GENERATE PAIRING CODE ==========
        console.log('\n\n========================================');
        console.log('📱 PAIRING CODE METHOD');
        console.log('========================================');
        console.log('🔄 Generating pairing code for number:', CONFIG.adminNumber);
        console.log('⏳ Please wait...\n');

        // Generate pairing code
        const code = await sock.requestPairingCode(CONFIG.adminNumber);
        
        if (code && !pairingCodeDisplayed) {
            pairingCodeDisplayed = true;
            console.log('\n========================================');
            console.log('🔑 YOUR PAIRING CODE:');
            console.log('   ╔══════════════════════════════════╗');
            console.log(`   ║     ${code}     ║`);
            console.log('   ╚══════════════════════════════════╝');
            console.log('========================================');
            console.log('📱 HOW TO PAIR:');
            console.log('1. Open WhatsApp on your phone');
            console.log('2. Tap the 3 dots (Android) or Settings (iOS)');
            console.log('3. Tap "Linked Devices"');
            console.log('4. Tap "Link a Device"');
            console.log('5. Enter the pairing code above');
            console.log('========================================\n\n');
        }

        // ========== MESSAGE HANDLER ==========
        sock.ev.on('messages.upsert', async (m) => {
            const msg = m.messages[0];
            if (!msg.message) return;

            const from = msg.key.remoteJid;
            const sender = msg.key.participant || from;
            let text = msg.message?.conversation || 
                      msg.message?.extendedTextMessage?.text || 
                      msg.message?.imageMessage?.caption || '';

            // Emoji reaction
            if (text) {
                const emoji = getEmojiReaction(text);
                if (emoji) {
                    try {
                        await sock.sendMessage(from, { react: { key: msg.key, text: emoji } });
                    } catch (e) {}
                }
            }

            // Command handling
            if (text.startsWith(CONFIG.prefix)) {
                const args = text.slice(CONFIG.prefix.length).trim().split(' ');
                const command = args.shift().toLowerCase();
                
                if (COMMANDS[command]) {
                    // Check admin
                    if (COMMANDS[command].adminOnly) {
                        const adminJid = CONFIG.adminNumber + '@s.whatsapp.net';
                        if (sender !== adminJid) {
                            await sock.sendMessage(from, { text: '⛔ *Admin only command*' });
                            return;
                        }
                    }
                    
                    try {
                        const response = await COMMANDS[command].execute(args, from, sender, false, sock);
                        if (response) {
                            await sock.sendMessage(from, { text: response });
                        }
                    } catch (error) {
                        console.error('Command error:', error);
                        await sock.sendMessage(from, { text: '❌ Error executing command' });
                    }
                }
            }
        });

    } catch (error) {
        console.error('❌ Connection error:', error);
        isConnecting = false;
        pairingCodeDisplayed = false;
        setTimeout(connectToWhatsApp, 5000);
    }
}

async function sendStartupMessage() {
    try {
        const adminJid = CONFIG.adminNumber + '@s.whatsapp.net';
        await sock.sendMessage(adminJid, {
            text: `🤖 *CHINTU BOT ONLINE*\n━━━━━━━━━━━━━━━━━━━━━━━\n✅ Connected to WhatsApp\n📊 50+ commands\n😊 Emoji reactions: ${CONFIG.emojiReactions ? 'ON' : 'OFF'}\n👑 Admin: ${CONFIG.adminNumber}\n📝 Prefix: ${CONFIG.prefix}\n━━━━━━━━━━━━━━━━━━━━━━━\nType .help for commands`
        });
    } catch (e) {
        console.log('⚠️ Could not send startup message (admin might not be paired yet)');
    }
}

// ========== START ==========
console.log('🚀 Starting Chintu Bot...');
console.log('📱 Generating pairing code for +' + CONFIG.adminNumber + '...');
connectToWhatsApp();

// Keep alive
setInterval(() => console.log('💓 Heartbeat'), 30000);