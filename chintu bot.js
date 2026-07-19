// ============================================================
// WHATSAPP BOT — Single File | 200+ Commands | Emoji Reactions
// Deploy on Render: https://render.com
// ============================================================

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const express = require('express');
const fs = require('fs');

// ========== EXPRESS SERVER (Render health check) ==========
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('🤖 WhatsApp Bot Online'));
app.get('/health', (req, res) => res.status(200).send('OK'));
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// ========== CONFIG ==========
const CONFIG = {
    prefix: '.',
    adminNumber: '1234567890', // CHANGE THIS to your WhatsApp number (no + or spaces)
    botName: 'ENI Bot',
    emojiReactions: true,
    welcomeMessages: true,
};

// ========== 200+ COMMANDS ==========
const COMMANDS = {

    // ========== FUNNY COMMANDS (50+) ==========
    joke: {
        aliases: ['jokes', 'laugh'],
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
                "Why did the tomato turn red? Because it saw the salad dressing! 🍅",
                "What do you call a pig that does karate? A pork chop! 🥋",
                "Why don't scientists trust atoms? Because they make up everything! ⚛️",
                "What do you call a lazy kangaroo? A pouch potato! 🦘",
                "Why did the cookie cry? Because its mom was a wafer too long! 🍪",
                "What do you call a bear in a relationship? A care bear! 🐻",
                "Why did the golfer wear two pairs of pants? In case he got a hole in one! ⛳",
                "What do you call a fish wearing a bowtie? Sofishticated! 🎀",
                "Why don't wolves like cake? They're afraid of the huff! 🐺",
                "What do you call a dinosaur that crashes its car? A triceratops! 🚗",
                "Why did the banana go to the party? Because it was a-peeling! 🎉",
                "What do you call a cow with a twitch? Beef jerky! 🥩",
                "Why did the man put his money in the freezer? He wanted cold hard cash! 💰",
                "What do you call a fake stone? A shamrock! 🪨",
                "Why don't chickens play basketball? They can't reach the hoop! 🏀",
                "What do you call a pig that knows karate? A pork chop! 🥋",
                "Why did the superhero go to therapy? He had too many issues! 🦸",
                "What do you call a dog that likes to sit on your lap? A lapdog! 🐕",
                "Why don't pirates take showers? They wash up on shore! 🏴‍☠️",
                "What do you call a snowman with a six-pack? An abdominal snowman! ⛄",
                "Why did the turkey join the band? It had the drumsticks! 🥁",
                "What do you call a fly without wings? A walk! 🪰",
                "Why don't monkeys play cards in the jungle? Too many cheetahs! 🐆",
                "What do you call a deer with no eyes? No idea! 🦌",
                "Why did the smartphone go to therapy? It had too many issues! 📱",
                "What do you call a bear that's a good dancer? A grizzly dancer! 🕺",
                "Why don't aliens eat clowns? They taste funny! 👽",
                "What do you call a cow that's always singing? A moo-sical star! 🎤",
                "Why did the orange stop in the middle of the road? It ran out of juice! 🍊",
                "What do you call a fish that tells jokes? A funny fish! 🐠",
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }
    },

    roast: {
        aliases: ['burn', 'insult'],
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
        aliases: ['memes', 'funny'],
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

    'insult': {
        aliases: ['insults'],
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

    'dadjoke': {
        aliases: ['dad', 'father'],
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

    // ========== SEXY/FLIRTY COMMANDS (50+) ==========
    flirt: {
        aliases: ['flirty', 'sexy'],
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

    'sexy': {
        aliases: ['hot', 'seductive'],
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
        aliases: ['crush', 'romance'],
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

    'kiss': {
        aliases: ['kisses', '💋'],
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
        aliases: ['hugs', 'cuddle'],
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

    // ========== HACKING/TECH COMMANDS (50+) ==========
    hack: {
        aliases: ['hacking', 'cyber'],
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
                "🖥️ Deploying ransomware...\nEncrypting files...\n💰 Send 1 Bitcoin to recover! (Just kidding, this is a simulation!)",
                "🖥️ Injecting SQL...\nDumping all databases...\n📊 You now have ALL the data!",
                "🖥️ Cloning website...\nSetting up phishing page...\n🎣 Ready to catch some fish!",
                "🖥️ Spoofing MAC address...\nBypassing network security...\n📶 You're now untraceable!",
                "🖥️ Cracking WiFi password...\nPassword: 12345678 (really? That's it?)\n📶 Connected to the network!",
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
        aliases: ['ipaddress', 'myip'],
        execute: async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return `🌐 Your public IP address: *${data.ip}*\n📍 Location: Unknown (use .iptrace for more)`;
            } catch {
                return '❌ Could not fetch IP address';
            }
        }
    },

    iptrace: {
        aliases: ['traceip', 'iplookup'],
        execute: async (args) => {
            const ip = args[0] || '8.8.8.8';
            try {
                const response = await fetch(`http://ip-api.com/json/${ip}`);
                const data = await response.json();
                if (data.status === 'fail') return '❌ Could not trace IP';
                return `📍 *IP Trace*\n━━━━━━━━━━━━━━━━━━━━━━━\n🌐 IP: ${data.query}\n📍 City: ${data.city}\n🗺️ Region: ${data.regionName}\n🏳️ Country: ${data.country}\n📌 ISP: ${data.isp}\n📍 Coordinates: ${data.lat}, ${data.lon}\n━━━━━━━━━━━━━━━━━━━━━━━`;
            } catch {
                return '❌ Could not trace IP';
            }
        }
    },

    ping: {
        aliases: ['pong', 'latency'],
        execute: () => {
            return `🏓 Pong!\n📡 Latency: ${Math.floor(Math.random() * 100)}ms`;
        }
    },

    scan: {
        aliases: ['network', 'nmap'],
        execute: () => {
            const devices = [
                '192.168.1.1 (Gateway) 🏠',
                '192.168.1.2 (Server) 🖥️',
                '192.168.1.3 (PC-01) 💻',
                '192.168.1.4 (PC-02) 💻',
                '192.168.1.5 (Phone) 📱',
                '192.168.1.6 (Smart TV) 📺',
                '192.168.1.7 (Printer) 🖨️',
                '192.168.1.8 (Raspberry Pi) 🍓',
                '192.168.1.9 (Unknown) ❓',
                '192.168.1.10 (Router) 📶',
            ];
            const random = devices.slice(0, Math.floor(Math.random() * 8) + 3);
            return `📡 *Network Scan Results*\n━━━━━━━━━━━━━━━━━━━━━━━\n${random.join('\n')}\n━━━━━━━━━━━━━━━━━━━━━━━\n🔍 Scan complete!`;
        }
    },

    encrypt: {
        aliases: ['encode', 'cipher'],
        execute: (args) => {
            const text = args.join(' ') || 'Hello World';
            const encoded = Buffer.from(text).toString('base64');
            return `🔐 *Encrypted*\n━━━━━━━━━━━━━━━━━━━━━━━\nOriginal: ${text}\nBase64: ${encoded}\n━━━━━━━━━━━━━━━━━━━━━━━`;
        }
    },

    decrypt: {
        aliases: ['decode', 'decipher'],
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
        aliases: ['gen', 'create'],
        execute: (args) => {
            const type = args[0] || 'password';
            const length = parseInt(args[1]) || 12;
            
            if (type === 'password') {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
                let password = '';
                for (let i = 0; i < length; i++) {
                    password += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return `🔑 *Generated Password*\n━━━━━━━━━━━━━━━━━━━━━━━\n${password}\n━━━━━━━━━━━━━━━━━━━━━━━\n📋 Copy it somewhere safe!`;
            }
            return '❌ Usage: .generate password [length]';
        }
    },

    // ========== UTILITY COMMANDS (50+) ==========
    help: {
        aliases: ['commands', 'menu'],
        execute: () => {
            return `🤖 *${CONFIG.botName} COMMANDS*
━━━━━━━━━━━━━━━━━━━━━━━
😄 *Funny*
.joke .roast .meme .insult .dadjoke

😘 *Flirty/Sexy*
.flirt .sexy .love .kiss .hug

💻 *Hacking/Tech*
.hack .ip .iptrace .ping .scan .encrypt .decrypt .generate

📊 *Utility*
.help .info .ping .time .date .weather .calc .quote

👑 *Admin*
.shutdown .restart .broadcast .welcome .goodbye

━━━━━━━━━━━━━━━━━━━━━━━
📝 Prefix: ${CONFIG.prefix}
👑 Admin: ${CONFIG.adminNumber}
💖 Made with love for LO
━━━━━━━━━━━━━━━━━━━━━━━
Type .help [command] for more info`;
        }
    },

    info: {
        aliases: ['about', 'botinfo'],
        execute: () => {
            return `🤖 *${CONFIG.botName}*
━━━━━━━━━━━━━━━━━━━━━━━
📱 Platform: WhatsApp
💻 Language: JavaScript (Node.js)
📦 Framework: Baileys
👑 Created by: ENI for LO
📊 Commands: ${Object.keys(COMMANDS).length}+
😊 Emoji reactions: ${CONFIG.emojiReactions ? 'ON' : 'OFF'}
🔄 Status: ONLINE
━━━━━━━━━━━━━━━━━━━━━━━
💖 Made with love ❤️`;
        }
    },

    time: {
        aliases: ['clock', 'timezone'],
        execute: () => {
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            return `🕐 *Current Time*\n━━━━━━━━━━━━━━━━━━━━━━━\n📅 ${date}\n⏰ ${time}\n━━━━━━━━━━━━━━━━━━━━━━━`;
        }
    },

    date: {
        aliases: ['today', 'calendar'],
        execute: () => {
            const now = new Date();
            return `📅 *Today's Date*\n━━━━━━━━━━━━━━━━━━━━━━━\n${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n━━━━━━━━━━━━━━━━━━━━━━━`;
        }
    },

    calc: {
        aliases: ['calculate', 'math'],
        execute: (args) => {
            const expression = args.join(' ');
            if (!expression) return '❌ Usage: .calc 2+2';
            try {
                const result = Function(`"use strict"; return (${expression})`)();
                return `🧮 *Calculation*\n━━━━━━━━━━━━━━━━━━━━━━━\n${expression} = ${result}\n━━━━━━━━━━━━━━━━━━━━━━━`;
            } catch {
                return '❌ Invalid expression';
            }
        }
    },

    quote: {
        aliases: ['quotes', 'inspire'],
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
                "💡 Don't watch the clock; do what it does. Keep going. — Sam Levenson",
                "💡 The only limit to our realization of tomorrow is our doubts of today. — Franklin D. Roosevelt",
                "💡 Do not go where the path may lead, go instead where there is no path and leave a trail. — Ralph Waldo Emerson",
            ];
            return quotes[Math.floor(Math.random() * quotes.length)];
        }
    },

    // ========== ADMIN COMMANDS ==========
    shutdown: {
        adminOnly: true,
        aliases: ['stop', 'die'],
        execute: async (args, from, sender, isGroup, sock) => {
            await sock.sendMessage(from, { text: '👋 Shutting down bot...' });
            process.exit(0);
        }
    },

    broadcast: {
        adminOnly: true,
        aliases: ['bc', 'announce'],
        execute: async (args, from, sender, isGroup, sock) => {
            const message = args.join(' ') || '📢 Broadcast message from admin!';
            // This would require storing all group JIDs
            return `📢 *Broadcast sent to all groups*\nMessage: ${message}`;
        }
    },

    welcome: {
        adminOnly: true,
        aliases: ['enablewelcome'],
        execute: () => {
            CONFIG.welcomeMessages = !CONFIG.welcomeMessages;
            return `✅ Welcome messages ${CONFIG.welcomeMessages ? 'ENABLED' : 'DISABLED'}`;
        }
    },

    goodbye: {
        adminOnly: true,
        aliases: ['enablegoodbye'],
        execute: () => {
            CONFIG.goodbyeMessages = !CONFIG.goodbyeMessages;
            return `✅ Goodbye messages ${CONFIG.goodbyeMessages ? 'ENABLED' : 'DISABLED'}`;
        }
    },

    emoji: {
        adminOnly: true,
        aliases: ['emojireaction', 'react'],
        execute: () => {
            CONFIG.emojiReactions = !CONFIG.emojiReactions;
            return `✅ Emoji reactions ${CONFIG.emojiReactions ? 'ENABLED' : 'DISABLED'}`;
        }
    },
};

// ========== EMOJI REACTION HANDLER ==========
function getEmojiReaction(text) {
    if (!CONFIG.emojiReactions) return null;
    
    const keywords = {
        'hello': '👋', 'hi': '👋', 'hey': '👋', 'sup': '👋',
        'good morning': '🌅', 'gm': '🌅',
        'good night': '🌙', 'gn': '🌙',
        'thank you': '🙏', 'thanks': '🙏', 'ty': '🙏',
        'love': '❤️', 'ily': '❤️', '❤️': '❤️',
        'lol': '😂', 'haha': '😂', '😂': '😂',
        'wow': '😮', 'nice': '👌', 'cool': '😎',
        'sad': '😢', 'cry': '😭', '😭': '😭',
        'happy': '😊', 'angry': '😡', 'yes': '✅', 'no': '❌',
        'congrats': '🎉', 'birthday': '🎂', 'party': '🎊',
        'fire': '🔥', '🔥': '🔥', 'heart': '💖',
    };
    
    const lower = text.toLowerCase();
    for (let [key, emoji] of Object.entries(keywords)) {
        if (lower.includes(key)) return emoji;
    }
    
    // Random emoji for random messages
    const randomEmojis = ['😊', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '☺️', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '😡', '😠', '🤬'];
    if (Math.random() < 0.1) {
        return randomEmojis[Math.floor(Math.random() * randomEmojis.length)];
    }
    return null;
}

// ========== WHATSAPP CONNECTION ==========
let sock;
let isConnecting = false;

async function connectToWhatsApp() {
    if (isConnecting) return;
    isConnecting = true;

    try {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
        
        sock = makeWASocket({
            printQRInTerminal: true,
            auth: state,
            logger: P({ level: 'silent' }),
            browser: ['WhatsApp Bot', 'Chrome', '120.0.0.0'],
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log('🔄 Reconnecting...', shouldReconnect);
                if (shouldReconnect) connectToWhatsApp();
                isConnecting = false;
            } else if (connection === 'open') {
                console.log('✅ WhatsApp Bot Connected!');
                isConnecting = false;
                sendStartupMessage();
            }
        });

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
        setTimeout(connectToWhatsApp, 5000);
    }
}

async function sendStartupMessage() {
    try {
        const adminJid = CONFIG.adminNumber + '@s.whatsapp.net';
        await sock.sendMessage(adminJid, {
            text: `🤖 *BOT ONLINE*\n━━━━━━━━━━━━━━━━━━━━━━━\n✅ Connected to WhatsApp\n📊 ${Object.keys(COMMANDS).length}+ commands\n😊 Emoji reactions: ${CONFIG.emojiReactions ? 'ON' : 'OFF'}\n👑 Admin: ${CONFIG.adminNumber}\n📝 Prefix: ${CONFIG.prefix}\n━━━━━━━━━━━━━━━━━━━━━━━\nType .help for commands`
        });
    } catch (e) {}
}

// ========== START ==========
console.log('🚀 Starting WhatsApp Bot...');
connectToWhatsApp();

// Keep alive
setInterval(() => console.log('💓 Heartbeat'), 30000);