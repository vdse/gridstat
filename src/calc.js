/**
 * TODO convention for template parameters
 */

const fs = require('node:fs');

const util = require('./util.js');
const is = require('./is.js');
const grid = require('./grid.js');

const config = require('../config');
console.log('----');
console.log(config);
console.log('----');
//const { FROM, TO } = require('../config').BTCUSTD;
const FROM = config.BTCUSDT.FROM;
const TO = config.BTCUSDT.TO;

/**
 * Function Description
 *
 * @param {Object} gtsr - Grid Trading Simalation Results
 * @param {number} bndp - Base Assets Number of Decimal Places
 * @param {number} qndp - Quote Assets Number of Decimal Places
 *
 */
function format(gtsr, bndp, qndp) {
  gtsr.from = new Date(gtsr.from).toISOString().slice(0,10);
  gtsr.to = new Date(gtsr.to).toISOString().slice(0,10);
  gtsr.lower = gtsr.lower.toFixed(qndp);
  gtsr.upper = gtsr.upper.toFixed(qndp);

  gtsr.inv = gtsr.inv.toFixed(2);
  gtsr.first = gtsr.first ? gtsr.first.toFixed(qndp) : '--';
  gtsr.balance = gtsr.balance.toFixed(qndp);
  gtsr.amount = gtsr.amount ? gtsr.amount.toFixed(bndp) : '--';
  gtsr.last = gtsr.last ? gtsr.last.toFixed(qndp) : '--';
  gtsr.annual_pc = gtsr.annual_pc.toFixed(2);
  gtsr.total_pnl = gtsr.total_pnl.toFixed(qndp);
  gtsr.total_pnl_pc = gtsr.total_pnl_pc.toFixed(2);
  gtsr.grid_profit = gtsr.grid_profit.toFixed(qndp);         // TODO handle NaN
  gtsr.grid_profit_pc = gtsr.grid_profit_pc.toFixed(2);   // TODO handle NaN
  gtsr.floating_pnl = gtsr.floating_pnl.toFixed(qndp);       // TODO handle NaN
  gtsr.floating_pnl_pc = gtsr.floating_pnl_pc.toFixed(2); // TODO handle NaN

  gtsr.first_base = gtsr.first_base.toFixed(bndp);
  gtsr.first_quote = gtsr.first_quote.toFixed(qndp);
  gtsr.total_exec = gtsr.total_exec.toFixed(0);
  gtsr.total_match = gtsr.total_match.toFixed(0); // <- TODO review maybe another function
  gtsr.last_base = gtsr.last_base.toFixed(bndp);
  gtsr.last_quote = gtsr.last_quote.toFixed(qndp);

  gtsr.grid = gtsr.grid.map(item => {
    item.lower = item.lower.toFixed(qndp);
    item.upper = item.upper.toFixed(qndp);
    item.inv = item.inv.toFixed(qndp);
    item.profit_per_grid = item.profit_per_grid.toFixed(qndp);
    item.profit_per_grid_pc = item.profit_per_grid_pc.toFixed(2);
    item.profit = item.profit.toFixed(qndp);
    item.base = item.base.toFixed(bndp);
    item.quote = item.quote.toFixed(qndp);
    item.first_base = item.first_base.toFixed(bndp);
    item.first_quote = item.first_quote.toFixed(qndp);
    return item
  });

  gtsr.log = gtsr.log.map(item => {
    item.grid += 1;
    item.buy.time = new Date(item.buy.time).toISOString().slice(0,19).replace('T', ' ');
    item.buy.price = item.buy.price.toFixed(qndp);
    item.buy.exec = item.buy.exec.toFixed(bndp);
    item.buy.total = item.buy.total.toFixed(qndp);
    item.buy.fee = item.buy.fee.toFixed(bndp);
    if(item.sell) {
      item.sell.time = new Date(item.sell.time).toISOString().slice(0,19).replace('T', ' ');
      item.sell.price = item.sell.price.toFixed(qndp);
      item.sell.exec = item.sell.exec.toFixed(bndp);
      item.sell.total = item.sell.total.toFixed(qndp);
      item.sell.fee = item.sell.fee.toFixed(bndp);
    }
    item.profit = item.profit ? item.profit.toFixed(qndp) : '--';
    return item
  });

  return gtsr;
}

async function calc(req, res, url) /* pathname === '/calc' */ {

  let symbol = url.searchParams.getAll('symbol').toString();
  let from = url.searchParams.getAll('from').toString();
  let to = url.searchParams.getAll('to').toString();
  let lower = url.searchParams.getAll('lower').toString();
  let upper = url.searchParams.getAll('upper').toString();
  let mode = url.searchParams.getAll('mode').toString();
  let grids = url.searchParams.getAll('grids').toString();
  let inv = url.searchParams.getAll('investment').toString();

  if(symbol === 'BTCUSDT') {

    if(
      symbol === 'BTCUSDT' // intentional temporary duplicate check
      && util.isValidDate(from)
      && util.isValidDate(to)
      && Date.parse(from) >= Date.parse(FROM)
      && Date.parse(from) <= Date.parse(TO)
      && Date.parse(to) >= Date.parse(FROM)
      && Date.parse(to) <= Date.parse(TO)
      && Date.parse(from) <= Date.parse(to)
      && util.isValidPriceRangeBoundary(lower)
      && util.isValidPriceRangeBoundary(upper)
      && Number(upper) > Number(lower) // TODO add to tests caser without Number; upper = 7000 > lower = 20000
      && util.isValidMode(mode)
      && util.isValidGrids(grids)
      && is.number(inv)
      && inv >= 1
    ) {

      lower = Number(lower);
      upper = Number(upper);
      grids = Number(grids);
      inv = Number(inv);
      const filename = `../data/BTCUSDT-trades-2023-01-11.csv.${String(grids).padStart(2, '0')}`;

      let obj = await grid(filename, new Date(from).getTime(), new Date(to).getTime(), lower, upper, mode, grids, inv);

      obj = format(obj, 6, 2);
      console.log(JSON.stringify(obj, null, 2));

      obj.recalculate = {link: `/${url.search}`};
      //console.log(JSON.stringify(obj, null, 2));

     //console.log(JSON.stringify(obj, null, 2));

      let calcPage = (obj) => eval("`" + fs.readFileSync('./layout/calc.html') + "`");
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(calcPage(obj));

    } else {
      res.writeHead(302, { Location: `http://${req.headers.host}/${url.search}` });
      res.end();
    }

  } else if(symbol === 'GTSTEST') {
    lower = Number(lower);
    upper = Number(upper);
    grids = Number(grids);
    inv = Number(inv);

    const filename = `../data/GTSTEST-trades-2023.csv`;

    let obj = await grid(filename, new Date(from).getTime(), new Date(to).getTime(), lower, upper, mode, grids, inv);
    console.log(JSON.stringify(obj, null, 2));

    obj = format(obj, 4, 2);

    //obj.recalculate = {link: `/${url.search}`};

    let calcPage = (obj) => eval("`" + fs.readFileSync('./layout/calc.html') + "`");
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(calcPage(obj));

  } else {
    res.writeHead(302, { Location: `http://${req.headers.host}/${url.search}` });
    res.end();
  }
}

module.exports = calc;

