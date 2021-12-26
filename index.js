const bot_tg_Api = require('node-telegram-bot-api')
const token = '5032275053:AAEDqvnJemeHjxPGpWleJEms_kaAYSbmfbQ'
const bot = new bot_tg_Api(token, {polling: true});
bot.setMyCommands ([
    {command: '/start', description: 'приветствие'},
    {command: '/info_about_me', description: 'назвать ник пользователя'},
    {command: '/flip_a_coin', description: 'Орел или Решка'},
    {command: '/curs', description: 'узнать курс валют'}
])
bot.on('message', (msg, match) =>{
    const text_user = msg.text;
    const chatId = msg.chat.id;
    const {first_name: user_name } = msg.chat;
    if (text_user === '/start') {
        bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/22c/b26/22cb267f-a2ab-41e4-8360-fe35ac048c3b/11.webp");
        return bot.sendMessage(chatId, `Привет ${msg.from.first_name}, добро пожаловать в universal_test_bot. Я тестовой бот. Мои возможности пока что ограничены ¯\_(ツ)_/¯, но ты можешь в меню взаимодействия понажимать кнопки и посмотреть что я умею :)`);
    }
    if (text_user === '/info_about_me') {
        bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/348/e30/348e3088-126b-4939-b317-e9036499c515/41.webp");
        return bot.sendMessage(chatId, `Ну что я могу сказать о тебе? Я знаю, что твой ник в телеграме ${msg.from.first_name} ${msg.from.last_name}, это пока что все`);
    }
    if (text_user === '/flip_a_coin') {
        const random_number = Math.floor(Math.random() * 3)
        bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/4c7/59c/4c759c8b-dcec-404b-a3bf-a00572ef927f/15.webp")
        if (random_number == 0) {
            bot.sendMessage(chatId, "Монета растворилась в воздухе")
        }
        if (random_number == 2) {
            bot.sendMessage(chatId, "Орел")
        }
        if (random_number == 1) {
            bot.sendMessage(chatId, "Решка")
        }
        return            
    }
    if (text_user === '/curs') {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Выберите какая валюта вас интересует', {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '€ - EUR',
                    callback_data: 'EUR'
                  }, {
                    text: '$ - USD',
                    callback_data: 'USD'
                  }, {
                    text: '₽ - RUR',
                    callback_data: 'RUR'
                  }, {
                    text: '₿ - BTC',
                    callback_data: 'BTC'
                  }
                ]
              ]
            }
          });
    bot.on('callback_query', query => {
        console.log(query)
        const id = query.message.chat.id;
        request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function (error, response, body) {
            const data = JSON.parse(body);
            const result = data.filter(item => item.ccy === query.data)[0];
            const flag = {
                'EUR': '🇪🇺',
                'USD': '🇺🇸',
                'RUR': '🇷🇺',
                'UAH': '🇺🇦',
                'BTC': '₿'
            }
            let md = `
            *${flag[result.ccy]} ${result.ccy} ${result.base_ccy} ${flag[result.base_ccy]}*
            Buy: _${result.buy}_
            Sale: _${result.sale}_
            `;
            bot.sendMessage(id, md, {parse_mode: 'Markdown'});
        })
    })
    return
    } 
    return bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/8c0/427/8c042720-c3bc-4b75-997e-25b666d88da4/1.webp");

})


