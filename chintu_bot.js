/// Render के लिए एक साधारण वेब सर्वर बनाना (ताकि पोर्ट एक्टिव रहे)
const http = require('http');
const PORT = process.env.PORT || 8000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('CHINTU BOT IS RUNNING 24/7\n');
}).listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
/ chintu_bot.js
// Code By CHINTU
// 📱 +91 9412185706

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const QRCode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// ===== CONFIG =====
const PREFIX = '.';
const OWNER = '9412185706';
const BOT_NAME = 'CHINTU BOT';

// ===== DATABASE =====
let db = {
    users: {},
    groups: {},
    banned: [],
    admins: [OWNER],
    warnings: {}
};

const DB_FILE = 'chintu_db.json';

function loadDB() {
    try {
        if (fs.existsSync(DB_FILE)) {
            db = JSON.parse(fs.readFileSync(DB_FILE));
        }
    } catch(e) {}
}

function saveDB() {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

loadDB();

// ===== COMMANDS =====
const commands = {};

// Basic Commands
commands['ping'] = (msg, args) => '🏓 Pong! Bot is alive!';
commands['help'] = (msg, args) => `
🤖 *CHINTU BOT COMMANDS*

📌 *BASIC:*
.ping - Check bot
.help - This menu
.info - Bot info
.profile - Your profile
.rank - Your rank
.leaderboard - Top users
.time - Current time
.calc 2+2 - Calculate
.echo hello - Repeat

👥 *GROUP MANAGEMENT:*
.add @user - Add member
.remove @user - Remove member
.promote @user - Promote to admin
.demote @user - Demote admin
.kick @user - Kick member
.ban @user - Ban member
.unban @user - Unban member
.warn @user - Warn member
.warnings @user - Check warnings
.mute @user - Mute member
.unmute @user - Unmute member

⚙️ *ADMIN:*
.group - Group info
.list - List members
.admin - Admin list
.stats - Bot stats
.broadcast msg - Broadcast

🎮 *FUN:*
.joke - Random joke
.quote - Random quote
.rps rock - Rock Paper Scissors
.dice - Roll dice
.flip - Coin flip
.8ball question - Ask 8ball

📱 *Code By: CHINTU*
📞 *+91 9412185706*
`;

commands['info'] = (msg, args) => `
🤖 *CHINTU BOT*
Version: 2.0
Developer: CHINTU
Contact: +91 9412185706
Status: ✅ Active
Features: Group Management, Auto-Reply
`;

commands['profile'] = (msg, args) => {
    const user = msg.key.remoteJid;
    if (!db.users[user]) db.users[user] = { points: 0, level: 1, joined: Date.now() };
    const u = db.users[user];
    return `
👤 *USER PROFILE*
Number: ${user}
Level: ${u.level}
Points: ${u.points}/100
Admin: ${db.admins.includes(user) ? '✅ Yes' : '❌ No'}
`;
};

commands['rank'] = (msg, args) => {
    const user = msg.key.remoteJid;
    if (!db.users[user]) db.users[user] = { points: 0, level: 1, joined: Date.now() };
    const u = db.users[user];
    const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Legend'];
    const rank = ranks[Math.min(u.level - 1, ranks.length - 1)];
    return `⭐ Your Rank: *${rank}* (Level ${u.level})`;
};

commands['leaderboard'] = (msg, args) => {
    const sorted = Object.entries(db.users)
        .sort((a, b) => b[1].level - a[1].level)
        .slice(0, 10);
    if (sorted.length === 0) return '📊 No users yet!';
    let text = '🏆 *TOP 10 USERS*\n\n';
    sorted.forEach(([user, data], i) => {
        const short = user.slice(0, 4) + '****' + user.slice(-4);
        text += `${i+1}. ${short} - Level ${data.level}\n`;
    });
    return text;
};

// Admin Commands
commands['add'] = (msg, args) => {
    if (!db.admins.includes(msg.key.remoteJid)) return '❌ Admin only!';
    if (!args.length) return '⚠️ Usage: .add @number';
    return `✅ Added ${args[0]}`;
};

commands['remove'] = (msg, args) => {
    if (!db.admins.includes(msg.key.remoteJid)) return '❌ Admin only!';
    if (!args.length) return '⚠️ Usage: .remove @number';
    return `✅ Removed ${args[0]}`;
};

commands['promote'] = (msg, args) => {
    if (!db.admins.includes(msg.key.remoteJid)) return '❌ Admin only!';
    if (!args.length) return '⚠️ Usage: .promote @number';
    if (!db.admins.includes(args[0])) {
        db.admins.push(args[0]);
        saveDB();
        return `✅ Promoted ${args[0]} to admin`;
    }
    return '❌ Already an admin';
};

commands['demote'] = (msg, args) => {
    if (!db.admins.includes(msg.key.remoteJid)) return '❌ Admin only!';
    if (!args.length) return '⚠️ Usage: .demote @number';
    if (args[0] === OWNER) return '❌ Cannot demote owner!';
    if (db.admins.includes(args[0])) {
        db.admins = db.admins.filter(a => a !== args[0]);
        saveDB();
        return `✅ Demoted ${args[0]}`;
    }
    return '❌ Not an admin';
};

commands['ban'] = (msg, args) => {
    if (!db.admins.includes(msg.key.remoteJid)) return '❌ Admin only!';
    if (!args.length) return '⚠️ Usage: .ban @number';
    if (!db.banned.includes(args[0])) {
        db.banned.push(args[0]);
        saveDB();
        return `🔨 Banned ${args[0]}`;
    }
    return '❌ Already banned';
};

commands['unban'] = (msg, args) => {
    if (!db.admins.includes(msg.key.remoteJid)) return '❌ Admin only!';
    if (!args.length) return '⚠️ Usage: .unban @number';
    if (db.banned.includes(args[0])) {
        db.banned = db.banned.filter(b => b !== args[0]);
        saveDB();
        return `✅ Unbanned ${args[0]}`;
    }
    return '❌ Not banned';
};

commands['warn'] = (msg, args) => {
    if (!db.admins.includes(msg.key.remoteJid)) return '❌ Admin only!';
    if (!args.length) return '⚠️ Usage: .warn @number';
    if (!db.warnings[args[0]]) db.warnings[args[0]] = 0;
    db.warnings[args[0]]++;
    if (db.warnings[args[0]] >= 3) {
        if (!db.banned.includes(args[0])) {
            db.banned.push(args[0]);
        }
        saveDB();
        return `⚠️ ${args[0]} has 3 warnings! BANNED!`;
    }
    saveDB();
    return `⚠️ Warned ${args[0]} (${db.warnings[args[0]]}/3 warnings)`;
};

commands['warnings'] = (msg, args) => {
    if (!db.admins.includes(msg.key.remoteJid)) return '❌ Admin only!';
    if (!args.length) return '⚠️ Usage: .warnings @number';
    const count = db.warnings[args[0]] || 0;
    return `⚠️ ${args[0]} has ${count}/3 warnings`;
};

commands['stats'] = (msg, args) => {
    if (!db.admins.includes(msg.key.remoteJid)) return '❌ Admin only!';
    return `
📊 *BOT STATISTICS*
Total Users: ${Object.keys(db.users).length}
Total Admins: ${db.admins.length}
Banned Users: ${db.banned.length}
Total Groups: ${Object.keys(db.groups).length}
`;
};

commands['group'] = (msg, args) => {
    if (!db.admins.includes(msg.key.remoteJid)) return '❌ Admin only!';
    const groupId = msg.key.remoteJid;
    return `📋 Group ID: ${groupId}`;
};

commands['admin'] = (msg, args) => {
    const list = db.admins.map(a => `  • +91 ${a}`).join('\n');
    return `👑 *ADMIN LIST*\n\n${list}`;
};

commands['broadcast'] = (msg, args) => {
    if (!db.admins.includes(msg.key.remoteJid)) return '❌ Admin only!';
    if (!args.length) return '⚠️ Usage: .broadcast <message>';
    return `📢 *BROADCAST:* ${args.join(' ')}`;
};

commands['time'] = (msg, args) => {
    const now = new Date().toLocaleString();
    return `🕐 Current Time: ${now}`;
};

commands['calc'] = (msg, args) => {
    if (!args.length) return '⚠️ Usage: .calc 2+2';
    try {
        const result = eval(args.join(' '));
        return `🧮 Result: ${result}`;
    } catch(e) {
        return '❌ Invalid expression';
    }
};

commands['echo'] = (msg, args) => {
    if (!args.length) return '⚠️ Usage: .echo <message>';
    return args.join(' ');
};

commands['joke'] = (msg, args) => {
    const jokes = [
        '😂 Why do programmers prefer dark mode? Because light attracts bugs!',
        '😂 What do you call a fake noodle? An impasta!',
        '😂 Why don\'t scientists trust atoms? Because they make up everything!',
        '😂 What did the code say to the bug? You\'ve been caught!',
        '😂 Why do Python programmers make good drummers? They have excellent rhythm!'
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
};

commands['quote'] = (msg, args) => {
    const quotes = [
        '💭 "The only way to do great work is to love what you do." - Steve Jobs',
        '💭 "Stay hungry, stay foolish." - Steve Jobs',
        '💭 "Be the change you wish to see in the world." - Gandhi',
        '💭 "The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt'
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
};

commands['rps'] = (msg, args) => {
    if (!args.length) return '⚠️ Usage: .rps rock|paper|scissors';
    const choices = ['rock', 'paper', 'scissors'];
    const user = args[0].toLowerCase();
    if (!choices.includes(user)) return '❌ Choose rock, paper, or scissors';
    const bot = choices[Math.floor(Math.random() * 3)];
    let result;
    if (user === bot) result = 'Tie! 🤝';
    else if ((user === 'rock' && bot === 'scissors') ||
             (user === 'paper' && bot === 'rock') ||
             (user === 'scissors' && bot === 'paper')) {
        result = 'You Win! 🎉';
    } else {
        result = 'I Win! 🤖';
    }
    return `🪨 You: ${user} | 🤖 Bot: ${bot}\n${result}`;
};

commands['dice'] = (msg, args) => {
    return `🎲 You rolled: ${Math.floor(Math.random() * 6) + 1}`;
};

commands['flip'] = (msg, args) => {
    return `🪙 Coin flip: ${Math.random() > 0.5 ? 'Heads' : 'Tails'}`;
};

commands['8ball'] = (msg, args) => {
    if (!args.length) return '⚠️ Ask a question! .8ball Will I win?';
    const responses = [
        'Yes definitely', 'Without a doubt', 'You can count on it',
        'Most likely', 'Reply hazy', 'Ask again later',
        'Better not tell you now', 'Cannot predict now',
        'Don\'t count on it', 'My sources say no', 'Very doubtful'
    ];
    return `🎱 ${responses[Math.floor(Math.random() * responses.length)]}`;
};

// ===== BOT MAIN =====
async function startBot() {
    console.log('\n🔥 CHINTU WHATSAPP BOT');
    console.log('📱 Code By: CHINTU');
    console.log('📞 +91 9412185706\n');
    console.log('📸 SCAN THE QR CODE BELOW WITH WHATSAPP:');
    console.log('📱 Open WhatsApp -> Linked Devices -> Link a Device\n');

    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        auth: state,
        browser: ['CHINTU BOT', 'Chrome', '1.0.0']
    });

    // ===== QR CODE HANDLER =====
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        // Show QR code when available
        if (qr) {
            console.log('\n📸 SCAN THIS QR CODE:');
            QRCode.generate(qr, { small: false });
            console.log('\n📱 Open WhatsApp -> Linked Devices -> Link a Device');
            console.log('🔄 Waiting for connection...\n');
        }
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed, reconnecting:', shouldReconnect);
            if (shouldReconnect) {
                startBot();
            } else {
                console.log('❌ Logged out. Please restart the bot.');
            }
        } else if (connection === 'open') {
            console.log('\n✅ BOT IS ONLINE!');
            console.log('📱 Waiting for messages...');
            console.log('📌 Type .help for commands\n');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;
        if (msg.key.fromMe) return;
        
        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        
        // Check banned
        if (db.banned.includes(sender)) return;
        
        // Process commands
        if (text.startsWith(PREFIX)) {
            const parts = text.slice(1).split(' ');
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1);
            
            if (commands[cmd]) {
                const response = commands[cmd](msg, args);
                if (response) {
                    await sock.sendMessage(sender, { text: response });
                }
            }
        }
        
        // Auto-reply for mentions
        if (text.toLowerCase().includes('chintu') || text.toLowerCase().includes('bot')) {
            await sock.sendMessage(sender, { 
                text: `🤖 *CHINTU BOT*\nType .help for commands!\n📱 +91 9412185706` 
            });
        }
    });
}

// Start the bot
startBot().catch(err => {
    console.log('❌ Error:', err);
    console.log('🔄 Restarting in 5 seconds...');
    setTimeout(() => startBot(), 5000);
});
