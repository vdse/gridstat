//import { open } from 'node:fs/promises';
const open = require('node:fs/promises').open;

//export async function grid() {

let fee = 0.001;

async function grid(from, to, lower, upper, mode, grids, inv) {
  //const file = await open('./test.csv');
  //const file = await open('../BTCUSDT-trades-2023-07.csv');
  const file = await open(`../data/BTCUSDT-trades-2023-01-11.csv.${String(grids).padStart(2, '0')}`);

  //let from = 0;
  //let to = 4 * 86400 * 1000;
  //let lower = 2.0;
  //let upper = 7.0;
  //let grids = 5;
  //let inv = 100.0;

  to += 86400000;

  let spread = (upper - lower) / grids;
  
  let grid = [];
  for(let i = 0; i < grids; i++) {
    grid[i] = {
      lower: lower + spread * i,
      upper: lower + spread * (i + 1),
    }
  }
  
  let amount = inv / grid.reduce((acc, val) => acc + val.lower, 0);
  
  let log = [];
  
  for(let i = 0; i < grids; i++) {
    grid[i].side = 'buy';
    grid[i].inv = amount * grid[i].lower;
    grid[i].base = 0.0;
    grid[i].quote = amount * grid[i].lower;
    grid[i].first_base = 0.0;
    grid[i].first_quote = 0.0;
    grid[i].exec = 0;
    grid[i].match = 0;
    grid[i].profit = 0;
    grid[i].profit_per_grid = amount * grid[i].upper * (1 - fee) * (1 - fee) - amount * grid[i].lower;
    grid[i].profit_per_grid_pc = grid[i].profit_per_grid / (amount * grid[i].lower) * 100.0;
  }
  
  let first = undefined;
  let last = undefined;
  let balance = 0;
  let first_base = 0;
  let first_quote = inv;
  let last_base = 0;
  let last_quote = inv;
  let total_exec = 0;
  let total_match = 0;
  
  let lines = 0;
  
  for await (const line of file.readLines()) {
    let trade = line.split(',');
    let id = Number(trade[0]);
    let price = Number(trade[1]);
    let qty = Number(trade[2]);
    let quote = Number(trade[3]);
    let time = Number(trade[4]);
    //console.log('id:', id, 'price:', price, 'qty:', qty, 'quote:', quote, 'time:', time);
    lines++;
  
    if(time >= from && time < to) {
      if(!first) {
        first = last = price;
        for(let i = 0; i < grids; i++) {
          if(price <= grid[i].lower) {
            grid[i].base = amount * (1 - fee);
            grid[i].quote -= amount * price;
            grid[i].side = 'sell';
            grid[i].exec = 1;
            log.unshift({grid: i, buy: {time: time, price: price, exec: amount, total: amount * price, fee: amount * fee}});
          }
        }
        for(let i = 0; i < grids; i++) {
          grid[i].first_base = grid[i].base;
          grid[i].first_quote = grid[i].quote;
        }
        first_base = grid.reduce((acc, val) => acc + val.base, 0);
        first_quote = grid.reduce((acc, val) => acc + val.quote, 0);
      } else {
        last = price;
        for(let i = 0; i < grids; i++) {
          if(grid[i].side == 'buy') {
            if(price <= grid[i].lower) {
              grid[i].base = amount * (1 - fee);
              grid[i].quote -= amount * price;
              grid[i].side = 'sell';
              grid[i].exec += 1;
              log.unshift({grid: i, buy: {time: time, price: price, exec: amount, total: amount * price, fee: amount * fee}});
            }
          } else { //        'sell'
            if(price >= grid[i].upper) {
              grid[i].quote += grid[i].base * price * (1 - fee);
              //grid[i].base = 0;
              grid[i].side = 'buy';
              grid[i].exec += 1;
              grid[i].match += 1;
              let j = log.findIndex((e) => e.grid == i); // grid[i].sell must be undefined
              log.unshift(log.splice(j, 1)[0]);
              log[0].sell = {time: time, price: price, exec: grid[i].base, total: grid[i].base * price, fee: grid[i].base * price * fee};
              grid[i].base = 0;
              /* Different Approaches to calculate floating profit */
              //log[0].profit = amount * log[0].sell.price * (1 - fee) * (1 - fee) - amount * log[0].buy.price;
              //grid[i].profit += log[0].profit;
              log[0].profit = grid[i].profit_per_grid;
              grid[i].profit += grid[i].profit_per_grid;
            }
          }
        }
      }
    }
  }
  
  if(last) {
    balance = 0;
    for(let i = 0; i < grids; i++) {
      //console.log('i:', i, 'base:', grid[i].base, 'quote:', grid[i].quote);
      balance += grid[i].base * last * (1 - fee);
      balance += grid[i].quote;
    }
  } else {
    balance = inv;
  }
  
  let total_pnl = balance - inv;
  let total_pnl_pc = total_pnl / inv * 100.0;
  let period = (to - from) / 86400000;
  let annual_pc = total_pnl_pc * 365 / period;
  let grid_profit = grid.reduce((acc, val) => acc + val.profit, 0);
  let grid_profit_pc = grid_profit / inv * 100;
  let floating_pnl = total_pnl - grid_profit;
  let floating_pnl_pc = floating_pnl / inv * 100;
  //let floating_pnl_pc = floating_pnl / inv * 365 / period;
  last_base = grid.reduce((acc, val) => acc + val.base, 0);
  last_quote = grid.reduce((acc, val) => acc + val.quote, 0);
  total_exec = grid.reduce((acc, val) => acc + val.exec, 0);
  total_match = grid.reduce((acc, val) => acc + val.match, 0);
  
  //console.log('inv:\t\t\t', inv);
  //console.log('amount:\t\t\t', amount);
  //console.log('first:\t\t\t', first);
  //console.log('first_base:\t\t', first_base);
  //console.log('first_quote:\t\t', first_quote);
  //console.log('total_exec:\t\t', total_exec);
  //console.log('total_match:\t\t', total_match);
  //console.log('last_base:\t\t', last_base);
  //console.log('last_quote:\t\t', last_quote);
  //console.log('last:\t\t\t', last);
  //console.log('balance:\t\t', balance);
  //console.log('total_pnl:\t\t', total_pnl);
  //console.log('total_pnl_pc:\t\t', total_pnl_pc);
  //console.log('period:\t\t\t', period);
  //console.log('annual_pc:\t\t', annual_pc);
  //console.log('grid_profit:\t\t', grid_profit);
  //console.log('grid_profit_pc:\t\t', grid_profit_pc);
  //console.log('floating_pnl:\t\t', floating_pnl);
  //console.log('floating_pnl_pc:\t', floating_pnl_pc);
  
  //console.table(grid);
  
//  for(let i = 0; i < grids; i++) {
//    log[i].buy = JSON.stringify(log[i].buy);
//    log[i].sell = JSON.stringify(log[i].sell);
//  }
  //console.table(log);
  
  //console.log(lines);

  let obj = {
    from: from,
    to: to,
    lower: lower,
    upper: upper,
    mode: mode,
    grids: grids,
    inv: inv,
    period: period,
    first: first,
    balance: balance,
    amount: amount,
    last: last,
    annual_pc: annual_pc,
    total_pnl: total_pnl,
    total_pnl_pc: total_pnl_pc,
    grid_profit: grid_profit,
    grid_profit_pc: grid_profit_pc,
    floating_pnl: floating_pnl,
    floating_pnl_pc: floating_pnl_pc,
    first_base: first_base,
    first_quote: first_quote,
    total_exec: total_exec,
    total_match: total_match,
    last_base: last_base,
    last_quote: last_quote,
  };

  obj.grid = grid;
  obj.log = log;

  // XXX tmp
  //obj.table = [];
  //obj.table2 = [];
  //obj.table3 = [];

  return obj;

}

module.exports = grid;
