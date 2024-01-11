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
user['1ad946be2a95c3cb9f75db5246766ce7'] = {country: 'Sweden', count: 0};
user['171ed70a577ee36c6ad96cfa8ed58980'] = {country: 'Canada', count: 0};

for await (const line of file.readLines()) {

  let rec = JSON.parse(line);
  records += 1;

  // Skip if bot detected by user-agent
  let b = bot[rec['user-agent']];
  if(b) {
    b.count++;
    continue;
  }

  // Skip if IP detected as Datacenter
  let d = dc[rec['x-forwarded-for']];
  if(d) {
    d.count++;
    continue;
  }

  // Skip becouse probably bot detected by accesing only html file
  let b2 = bot2[rec['x-forwarded-for-hash']];
  if(b2) {
    b2.count++;
    continue;
  }

  // Identified as human
  let u = user[rec['x-forwarded-for-hash']];
  if(u) {
    u.count++;
    continue;
  }

  let hash = rec['x-forwarded-for-hash'];
  if(res[hash] == undefined) {
    res[hash] = { count: 1, ip: rec['x-forwarded-for']};
  } else {
    res[hash].count++;
  }

  console.log(rec);

}

console.log(bot);
console.log(bot2);
console.log('Datacenter:');
console.log(dc);
console.log('Users:');
console.log(user);

console.log(res);
console.log('unique ip:', Object.keys(res).length);

console.log('records:', records);

