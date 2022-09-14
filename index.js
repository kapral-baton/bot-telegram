const TelegramApi = require('node-telegram-bot-api');
const token = '5675060373:AAExY_n4LnkGGj8m319oPiRSoRIPfnvImwo';
const bot = new TelegramApi(token, {polling: true});
const {gameOptions, againOptions} = require('./options');

bot.setMyCommands([
    {command: '/start', description: 'Знакомство с ботом'},
    {command: '/baton', description: 'Расказ о батоне'},
    {command: '/game', description: 'игра угадай цыфру '},
]);

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `сейчас я загадаю цыфру от 0 до 9, а ты должен ее угадать!`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'отгадывай', gameOptions);
};



const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await  bot.sendSticker(chatId , 'https://tlgrm.ru/_/stickers/bec/9cd/bec9cdeb-85c4-3b61-87a0-5ca23564a415/7.webp');
            return bot.sendMessage(chatId, `васап поцанам от батона`);
        }
        if (text === '/baton') {
            return bot.sendMessage(chatId, 'батоны топ')
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, `я тебя не понимаю`);
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `поздравляю ты угадал цыфру ${chats[chatId]}`, againOptions);
        }else {
            return bot.sendMessage(chatId, ` к сожелению ты не угадал, бот загадал цыфру ${chats[chatId]}`, againOptions);
        }

    })
};

start();

