//const open = require('node:fs/promises').open;
import { open }  from 'node:fs/promises';

const file = await open('./log');

let res = [];
let records = 0;

let bot = [];
bot['Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'] = {count: 0};
bot['curl/7.54.0'] = {count: 0};
bot['TelegramBot (like TwitterBot)'] = {count: 0};

let bot2 = [];
bot2['74cdb3041e761eda70cb5bf70e3dc90c'] = {country: 'Singapore', count: 0};
bot2['15193e6aa3c75f9a87f5f17353d9f0d2'] = {country: 'Hong Kong', count: 0};

let dc = [];
dc['134.209.0.0'] = {country: 'United States', count: 0};

let user = [];

for await (const line of file.readLines()) {

  let rec = JSON.parse(line);
  records += 1;

  let url = rec['url'];
  let ip = rec['x-forwarded-for'];
  if(url == 'http://grid-trading-strategy.info/usdt.svg') {
    let u = user[ip];
    if(u == undefined) {
      user[ip] = {ip, count: 1};
    } else {
      u.count++;
    }
  }

  //console.log(rec);

}

//console.log(bot);
//console.log(bot2);
//console.log('Datacenter:');
//console.log(dc);
console.log('Users:');
console.log(user);

//console.log(res);
//console.log('unique ip:', Object.keys(res).length);
//
//console.log('records:', records);

