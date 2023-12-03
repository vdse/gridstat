const config = require('./config.js');

let from = '2023-07-31';
let to = '2023-01-01';
let lower = '1000';
let upper = '2000';
let mode = 'arithmetic';
let grids = '10';
let investment = '1000';

let obj = {
  title: `Date Range 5_5 (from=${from} & to=${to})`,
  method: 'GET',
  pathname: '/',
  search: `?from=${from}&to=${to}&lower=${lower}&upper=${upper}&mode=${mode}&grids=${grids}&investment=${investment}`,
  layout: 'testLayout',
  obj: {
    from: {
      value: from,
      //valid: false,
      min: config.FROM,
      max: config.TO,
      status: {
      /*
        date: {
          class: 'pass',
          symbol: 'v&nbsp;',
          message: `Expected format in URL: YYYY-MM-DD; received \'${from ? from : ''}\'`,
        },
        out_of_range: {
          class: 'pass',
          symbol: 'v&nbsp;',
          message: `Expected to be in range ${config.FROM} ... ${config.TO}`,
        },
      */
      },
    },
    to: {
      value: to,
      min: config.FROM,
      max: config.TO,
      status: {
        date: {
          class: 'pass',
          symbol: 'v&nbsp;',
          message: `Expected format in URL: YYYY-MM-DD; received \'${to ? to : ''}\'`,
        },
        out_of_range: {
          class: 'pass',
          symbol: 'v&nbsp;',
          message: `Expected to be in range ${config.FROM} ... ${config.TO}`,
        },
        to_ge_from: {
          class: 'fail',
          symbol: 'x&nbsp;',
          message: `To is expected to be greater than or equal to From`,
        },
      },
    },
    lower: {
      value: lower,
    },
    upper: {
      value: upper,
    },
    mode: {
      value: mode,
    },
    grids: {
      value: grids,
    },
    investment: {
      value: investment,
    },
  },
};

module.exports = obj;

