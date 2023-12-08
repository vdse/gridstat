const http = require('node:http');
const fs = require('node:fs');
const URL = require('node:url').URL;

const util = require('./util.js');
const is = require('./is.js');

const { FROM, TO }= require('../config');

///**
// * TODO naming, maybe better structure
// * {
// *   from: {
// *     value: Date | undefined,
// *     valid: true | false,
// *     status: {
// *       date:         pass | fail
// *       ge_conf_from: pass | na | fail
// *       le_conf_to:   pass | na | fail
// *       to_ge_from:   pass | na | fail
// *     }
// *   },
// *   to: {
// *     value: Date | undefined,
// *     valid: true | false,
// *     status: {
// *       date:         pass | fail
// *       ge_conf_from: pass | na | fail
// *       le_conf_to:   pass | na | fail
// *       to_ge_from:   pass | na | fail
// *     }
// *   },
// *   lower: {
// *     value: Number | undefined,
// *     valid: true | false,
// *     status: {
// *       number:       pass | fail
// *       ge1000:       pass | na | fail
// *       multiple_1e3: pass | na | fail
// *     },
// *     status: {
// *       number:       true | false
// *       ge1000:       true | undefined (not applicable) | false
// *       multiple_1e3: true | undefined (not applicable) | false
// *     }
// *   },
// *   upper: {
// *     value: Number | undefined,
// *     status: {
// *       number:       undefined | 'pass' | 'not applicalbe' | 'fail'
// *       ge2000:       undefined | pass | not applicable | fail
// *       multiple_1e3: undefined | pass | not applicable | fail
// *       gt_lower:     undefined | pass | not applicable | fail
// *     }
// *   },
// *   mode: {
// *     value: String | undefined,
// *     status: {
// *       arithmetic:   hidden | pass | not applicable | fail
// *     }
// *   },
// *   quantity: {
// *     value: Number | NaN,
// *     status: {
// *       number:       undefined | pass | not applicable | fail
// *       ge2:          undefined | pass | not applicable | fail
// *       le20:         undefined | pass | not applicable | fail
// *     }
// *   }
// * }
// *
// */

const server = http.createServer({}, (req, res) => {
//    // console.log('http request');
////   console.log(req.headers); // TODO try catch for internal server error
////   // TODO find way how to make request to https server with command line utils like telnet, netcat, etc
////   // TODO undertand behaviour of redirect if domain don't match
////   // TODO check if host www.gridstat.softevol.net or gridstat.softevol.net
////   if(req.headers.host.startsWith('www.')) { // TODO check if host missing
////     console.log('if');
////     res.writeHead(301, { Location: `https://${req.headers.host.substring(4)}${req.url}` });
////     res.end();
////   } else {
////     // TODO error not must crash server
//    let { /*href,*/ pathname, /*search,*/ query } = url.parse('http://' + req.headers.host + req.url);
//    console.log('pathname: ' + pathname);
//    console.log('query: ' + query);


  // TODO check for method

  let url = new URL(req.url, 'http://' + req.headers.host + '/');
  let pathname = url.pathname;
  let search = url.search;

//     /**
//      * TODO (for next project) consider automatic validation and status message generation using JSON Schema
//      * greater than https://github.com/json-schema-org/json-schema-spec/issues/51
//      * review for schema generation https://github.com/fastify/fluent-json-schema
//      * documentation https://json-schema.org/draft/2020-12/json-schema-validation
//      */


    if (pathname === '/') {

      if(
        url.searchParams.getAll('from').length == 0
        && url.searchParams.getAll('to').length == 0
        && url.searchParams.getAll('lower').length == 0
        && url.searchParams.getAll('upper').length == 0
        && url.searchParams.getAll('mode').length == 0
        && url.searchParams.getAll('grids').length == 0
      ) {
        let obj = {
          from: {
            value: '',
            min: FROM,
            max: TO,
            status: {},
          },
          to: {
            value: '',
            min: FROM,
            max: TO,
            status: {},
          },
          lower: {
            value: '',
            status: {},
          },
          upper: {
            value: '',
            status: {},
          },
          mode: {
            value: '',
          },
          grids: {
            value: '',
          },
          investment: {
            value: '',
          },
        };

        let index = (obj) => eval("`" + fs.readFileSync('./layout/index.html') + "`");
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(index(obj));

      } else {

        let from = url.searchParams.getAll('from').toString();
        let to = url.searchParams.getAll('to').toString();
        let lower = url.searchParams.getAll('lower').toString();
        let upper = url.searchParams.getAll('upper').toString();
        let mode = url.searchParams.getAll('mode').toString();
        let grids = url.searchParams.getAll('grids').toString();
        // TODO in future version can be base inv and quote inv, maybe unify in this version?
        let investment = url.searchParams.getAll('investment').toString();

        // TODO remade
        function date_class(date) {
          return util.isValidDate(date)
            ? (Date.parse(from) >= Date.parse(FROM) && Date.parse(from) <= Date.parse(TO) ? 'pass' : 'fail')
            : 'na'
        }
        function date_symbol(date) {
          return util.isValidDate(date)
            ? (Date.parse(from) >= Date.parse(FROM) && Date.parse(from) <= Date.parse(TO) ? 'v&nbsp;' : 'x&nbsp;') : '-&nbsp;'
        }

        let obj = {
          // TODO na status
          from: {
            value: is.iso(from) ? from : undefined,
            min: FROM,
            max: TO,
            status: {
              format: {
                class: is.iso(from) ? 'pass' : 'fail',
                symbol: is.iso(from) ? 'v&nbsp;' :  'x&nbsp;',
                message: `Expected format in URL: YYYY-MM-DD; received \'${from ? from : ''}\'`,
              },
              within_range: {
                class: is.iso(from) ? is.range(from) ? 'pass' : 'fail' : 'na',
                symbol: is.iso(from) ? is.range(from) ?  'v&nbsp;' : 'x&nbsp;' : '-&nbsp;',
                message: `Expected to be in range ${FROM} ... ${TO}`,
              },
            },
          },
          to: {
            value: util.isValidDate(to) ? to : undefined,
            min: FROM,
            max: TO,
            status: {
              format: {
                class: is.iso(to) ? 'pass' : 'fail',
                symbol: is.iso(to) ? 'v&nbsp;' :  'x&nbsp;',
                message: `Expected format in URL: YYYY-MM-DD; received \'${to ? to : ''}\'`,
              },
              within_range: {
                class: is.iso(to) ? is.range(to) ? 'pass' : 'fail' : 'na',
                symbol: is.iso(to) ? is.range(to) ?  'v&nbsp;' : 'x&nbsp;' : '-&nbsp;',
                message: `Expected to be in range ${FROM} ... ${TO}`,
              },
              to_ge_from: {
                class: is.iso(from) && is.iso(to) ? from <= to ? 'pass' : 'fail' : 'na',
                symbol: is.iso(from) && is.iso(to) ? from <= to ? 'v&nbsp;' : 'x&nbsp;' : '-&nbsp;',
                message: `To is expected to be greater than or equal to From`,
                // is.iso(from) && is.iso(to) ? from <= to ? 'pass' : 'fail' : 'na',
              },
            },
          },
          lower: {
            value: util.isNumber(lower) ? lower : undefined,
            status: {
              number: {
                class: is.number(lower) ? 'pass' : 'fail',
                symbol: is.number(lower) ? 'v&nbsp;' :  'x&nbsp;',
                message: `Number Expected; received \'${lower ? lower : ''}\'`,
              },
              ge_1e3: {
                class: is.number(lower) ? lower >= 1e3 ? 'pass' : 'fail' : 'na',
                symbol: is.number(lower) ? lower >= 1e3 ? 'v&nbsp;' : 'x&nbsp;' : '-&nbsp;',
                message: `Greater than or equal to 1000`,
              },
              multiples_of_1e3: {
                class: is.number(lower) ? !(lower % 1e3) ? 'pass' : 'fail' : 'na',
                symbol: is.number(lower) ? !(lower % 1e3) ? 'v&nbsp;' : 'x&nbsp;' : '-&nbsp;',
                message: `Multiples of a 1000`,
              },
            },
          },
          upper: {
            value: util.isNumber(upper) ? upper : undefined,
            status: {
              number: {
                class: is.number(upper) ? 'pass' : 'fail',
                symbol: is.number(upper) ? 'v&nbsp;' :  'x&nbsp;',
                message: `Number Expected; received \'${upper ? upper : ''}\'`,
              },
              ge_2e3: {
                class: is.number(upper) ? upper >= 2e3 ? 'pass' : 'fail' : 'na',
                symbol: is.number(upper) ? upper >= 2e3 ? 'v&nbsp;' : 'x&nbsp;' : '-&nbsp;',
                message: `Greater than or equal to 2000`,
              },
              multiples_of_1e3: {
                class: is.number(upper) ? !(upper % 1e3) ? 'pass' : 'fail' : 'na',
                symbol: is.number(upper) ? !(upper % 1e3) ? 'v&nbsp;' : 'x&nbsp;' : '-&nbsp;',
                message: `Multiples of a 1000`,
              },
              gt_lower: {
                class: is.number(lower) && is.number(upper) ? Number(upper) > Number(lower) ? 'pass' : 'fail' : 'na',
                symbol: is.number(lower) && is.number(upper) ? Number(upper) > Number(lower) ? 'v&nbsp;' : 'x&nbsp;' : '-&nbsp;',
                message: `Greater than Lower`,
              },
            },
          },
          mode: {
            value: mode, // value not used at this moment
            status: {
              arithmetic: {
                class: is.arithmetic(mode) ? 'pass' : 'fail',
                symbol: is.arithmetic(mode) ? 'v&nbsp;' : 'x&nbsp;',
                message: `Supporting Arithmetic mode only, received: \'${mode == undefined ? '' : mode}'`,
              },
            }
          },
          grids: {
            value: is.number(grids) ? grids : undefined,
            status: {
              integer: {
                class: is.number(grids) && Number.isInteger(Number(grids)) ? 'pass' : 'fail',
                symbol: is.number(grids) && Number.isInteger(Number(grids)) ? 'v&nbsp;' : 'x&nbsp;',
                message: `Integer expected, received: \'${grids}'`,
              },
              within_range: {
                class: is.number(grids) ? grids >= 2 && grids <= 20 ? 'pass' : 'fail' : 'na',
                symbol: is.number(grids) ? grids >= 2 && grids <= 20 ?  'v&nbsp;' : 'x&nbsp;' : '-&nbsp;',
                message: `Expected to be within range 2 ... 20`,
              },
            },
          },
          investment: {
            value: is.number(investment) ? investment : undefined,
            status: {
              number: {
                class: is.number(investment) ? 'pass' : 'fail',
                symbol: is.number(investment) ? 'v&nbsp;' : 'x&nbsp;',
                message: `Integer expected, received: \'${investment}'`,
              },
              ge_1: {
                class: is.number(investment) ? investment >= 1 ? 'pass' : 'fail' : 'na',
                symbol: is.number(investment) ? investment >= 1 ?  'v&nbsp;' : 'x&nbsp;' : '-&nbsp;',
                message: `Expected to be greater than 1`,
              },
            },
          },
        };

        // Hide status messages if all pass
        if(
          obj.from.status.format.class == 'pass'
          && obj.from.status.within_range.class == 'pass'
        ) {
          obj.from.status = {};
        }

        if(
          obj.to.status.format.class == 'pass'
          && obj.to.status.within_range.class == 'pass'
          && obj.to.status.to_ge_from.class == 'pass'
        ) {
          obj.to.status = {};
        }

        if(
          obj.lower.status.number.class == 'pass'
          && obj.lower.status.ge_1e3.class == 'pass'
          && obj.lower.status.multiples_of_1e3.class == 'pass'
        ) {
          obj.lower.status = {};
        }

        if(
          obj.upper.status.number.class == 'pass'
          && obj.upper.status.ge_2e3.class == 'pass'
          && obj.upper.status.multiples_of_1e3.class == 'pass'
          && obj.upper.status.gt_lower.class == 'pass'
        ) {
          obj.upper.status = {};
        }

        if(
          obj.mode.status.arithmetic.class == 'pass'
        ) {
          obj.mode.status = {};
        }

        if(
          obj.grids.status.integer.class == 'pass'
          && obj.grids.status.within_range.class == 'pass'
        ) {
          obj.grids.status = {};
        }

        if(
          obj.investment.status.number.class == 'pass'
          && obj.investment.status.ge_1.class == 'pass'
        ) {
          obj.investment.status = {};
        }


        //let obj2 = require('./date_range_5_5.js');
        let index = (obj) => eval("`" + fs.readFileSync('./layout/index.html') + "`");
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(index(obj));

      }

    } else if (pathname === '/calc') {

      let from = url.searchParams.getAll('from').toString();
      let to = url.searchParams.getAll('to').toString();
      let lower = url.searchParams.getAll('lower').toString();
      let upper = url.searchParams.getAll('upper').toString();
      let mode = url.searchParams.getAll('mode').toString();
      let grids = url.searchParams.getAll('grids').toString();

      if(
        util.isValidDate(from)
        && util.isValidDate(to)
        && Date.parse(from) >= Date.parse(FROM)
        && Date.parse(from) <= Date.parse(TO)
        && Date.parse(to) >= Date.parse(FROM)
        && Date.parse(to) <= Date.parse(TO)
        && Date.parse(from) <= Date.parse(to)
        && util.isValidPriceRangeBoundary(lower)
        && util.isValidPriceRangeBoundary(upper)
        && upper > lower
        && util.isValidMode(mode)
        && util.isValidGrids(grids)
      ) {
        let obj = {
          from: {
            value: from,
          },
          to: {
            value: to,
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
            value: '1000',
          },
          recalculate: {
            link: `/${search}`
          },
          table: [
            ['1', '2.00 USDT', '3.00 USDT', '10.00 USDT', '5.00 BTC', '5 USDT / 50.00%'],
            ['2', '3.00 USDT', '4.00 USDT', '15.00 USDT', '5.00 BTC', '5 USDT / 33.33%'],
            ['3', '4.00 USDT', '5.00 USDT', '20.00 USDT', '5.00 BTC', '5 USDT / 25.00%'],
            ['4', '5.00 USDT', '6.00 USDT', '25.00 USDT', '5.00 BTC', '5 USDT / 20.00%'],
            ['5', '6.00 USDT', '7.00 USDT', '30.00 USDT', '5.00 BTC', '5 USDT / 16.67%'],
          ],
          table2: [
            ['1',  '0.00 USDT + 5.00 BTC', '2', '1', '15.00 USDT', '15.00 USDT + 0.00 BTC'],
            ['2',  '5.00 USDT + 5.00 BTC', '2', '1', '20.00 USDT', '20.00 USDT + 0.00 BTC'],
            ['3', '10.00 USDT + 5.00 BTC', '2', '1', '25.00 USDT', '25.00 USDT + 0.00 BTC'],
            ['4', '15.00 USDT + 5.00 BTC', '2', '1', '30.00 USDT', '30.00 USDT + 0.00 BTC'],
            ['5', '20.00 USDT + 5.00 BTC', '2', '1', '35.00 USDT', '35.00 USDT + 0.00 BTC'],
          ],
          table3: [
            {
              grid: '1',
              table: [
                ['1', '2023-10-27 19:30:47', 'Sell', '33.00', '0.74', '25.1600 USDT', '0.7342 BTC' ],
              ],
              profit: '--',
            },
            {
              grid: '2',
              table: [
                ['2', '2023-10-27 19:30:47', 'Buy',  '33.00', '0.74', '25.1600 USDT', '0.7342 BTC' ],
                ['2', '2023-10-27 19:30:47', 'Sell', '34.00', '0.74', '25.5548 USDT', '0.0251 USDT'],
              ],
              profit: '0.6895 USDT',
            },
          ],
        };

        let calcPage = (obj) => eval("`" + fs.readFileSync('./layout/calc.html') + "`");
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(calcPage(obj));

      } else {
        res.writeHead(302, { Location: `http://${req.headers.host}/${search}` });
        res.end();
      }
    } else if(pathname == '/favicon.ico') {
      res.setHeader('Content-Type', 'image/x-icon');
      res.write(fs.readFileSync('favicon.ico'));
      res.end();
    } else if(pathname == '/style.css') {
      res.setHeader('Content-Type', 'text/css');
      res.write(fs.readFileSync('layout/style.css'));
      res.end();
    } else if(pathname == '/calc.css') {
      res.setHeader('Content-Type', 'text/css');
      res.write(fs.readFileSync('layout/calc.css'));
      res.end();
    } else {
      res.writeHead(404).end();
    }

});

server.listen(8080);

