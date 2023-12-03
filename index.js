const http = require('node:http');
const fs = require('node:fs');
const URL = require('node:url').URL;
//const querystring = require('querystring');
const config = require('./config');

const util = require('./util.js');

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

//// TODO Validation lower price value
//function lowerPriceRage(lower) {
//    let lowerData = {
//        value: isNotValidNumber(lower) ? undefined : lower,
//        valid: undefined,
//        status: {}
//    };
//
//    if (isNotValidNumber(lower)) {
//        lowerData.status.number = 'fail';
//        lowerData.status.ge1000 = 'na';
//        lowerData.status.multiple_1e3 = 'na';
//    } else {
//        lowerData.status.number = 'pass'
//        lowerData.status.ge1000 = (lower >= 1000) ? 'pass' : 'fail';
//        lowerData.status.multiple_1e3 = (lower % 1000 === 0) ? 'pass' : 'fail';
//    }
//
//    lowerData.valid = (lowerData.status.number === 'pass') && (lowerData.status.ge1000 === 'pass') && (lowerData.status.multiple_1e3 === 'pass');
//
//    return lowerData;
//}
//
//// TODO Validation upper price value
//function upperPriceRage(lower, upper) {
//    let upperData = {
//        value: isNotValidNumber(upper) ? undefined : upper,
//        valid: undefined,
//        status: {}
//    };
//
//    if (isNotValidNumber(upper)) {
//        upperData.status.number = 'fail';
//        upperData.status.ge2000 = 'na';
//        upperData.status.multiple_1e3 = 'na';
//        upperData.status.gt_lower = 'na';
//    } else {
//        upperData.status.number = 'pass'
//        upperData.status.ge2000 = (upper >= 2000) ? 'pass' : 'fail';
//        upperData.status.multiple_1e3 = (upper % 1000 === 0) ? 'pass' : 'fail';
//    }
//
//    if (isNotValidNumber(lower) || isNotValidNumber(upper)) {
//        upperData.status.gt_lower = 'na';
//    } else {
//        upperData.status.gt_lower = (upper > lower) ? 'pass' : 'fail';
//    }
//
//    upperData.valid = (upperData.status.number === 'pass') && (upperData.status.ge2000 === 'pass') && (upperData.status.multiple_1e3 === 'pass') && (upperData.status.gt_lower === 'pass');
//
//    return upperData;
//}
//
//// TODO Validation mode value in grid parameters
//function modeGridParameter(mode) {
//    let modeData = {
//        value: mode,
//        valid: undefined,
//        status: {}
//    };
//
//    if (mode === undefined) {
//        modeData.status.arithmetic = 'na';
//    } else {
//        modeData.status.arithmetic = (mode === 'arithmetic') ? 'pass' : 'fail';
//    }
//
//    modeData.valid = (modeData.status.arithmetic === 'pass');
//
//    return modeData;
//}
//
//// TODO Validation quantity value in grid parameters
//function quantityGridParameter(quantity) {
//    let quantityData = {
//        value: isNotValidNumber(quantity) ? undefined : quantity,
//        valid: undefined,
//        status: {}
//    };
//
//    if (isNotValidNumber(quantity)) {
//        quantityData.status.number = 'fail';
//        quantityData.status.ge2 = 'na';
//        quantityData.status.le20 = 'na';
//    } else {
//        quantityData.status.number = (quantity % 1 === 0) ? 'pass' : 'fail';
//        quantityData.status.ge2 = (quantity >= 2) ? 'pass' : 'fail';
//        quantityData.status.le20 = (quantity <= 20) ? 'pass' : 'fail';
//    }
//
//    quantityData.valid = (quantityData.status.number === 'pass') && (quantityData.status.ge2 === 'pass') && (quantityData.status.le20 === 'pass');
//
//    return quantityData;
//}
//
//// TODO Build recalculate link
//function recalculateLink(obj) {
//
//    let params = new URLSearchParams();
//
//    if (obj.from.value) params.set('from', obj.from.value);
//    if (obj.to.value) params.set('to', obj.to.value);
//    if (obj.lower.value) params.set('lower', obj.lower.value);
//    if (obj.upper.value) params.set('upper', obj.upper.value);
//    if (obj.mode.value) params.set('mode', obj.mode.value);
//    if (obj.quantity.value) params.set('quantity', obj.quantity.value);
//    if (obj.investment.value) params.set('investment', obj.investment.value);
//
//    let queryString = params.toString();
//
//    return {
//        recalculate: {
//            link: queryString ? "/?" + queryString : "/"
//        }
//    };
//}
//
//// TODO build query string from query params
//function getQueryString(params) {
//    return Object.keys(params)
//        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
//        .join('&');
//}

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

//    const queryParams = querystring.decode(query);
//    console.log('params: ' + JSON.stringify(queryParams));

//    // empty mode fill by user
//
//    let investment = queryParams.investment === undefined ? '' : queryParams.investment;
//
//    // TODO to >= from
//    let data = {
//        from: fromDateRange(queryParams.from),
//        to: toDateRange(queryParams.from, queryParams.to),
//        lower: lowerPriceRage(queryParams.lower),
//        upper: upperPriceRage(queryParams.lower, queryParams.upper),
//        mode: modeGridParameter(queryParams.mode),
//        quantity: quantityGridParameter(queryParams.quantity),
//        investment: {
//            value: investment
//        }
//    };
//
////     /**
////      * TODO (for next project) consider automatic validation and status message generation using JSON Schema
////      * greater than https://github.com/json-schema-org/json-schema-spec/issues/51
////      * review for schema generation https://github.com/fastify/fluent-json-schema
////      * documentation https://json-schema.org/draft/2020-12/json-schema-validation
////      */
////
////     const parsedUrl = url.parse(req.url, true);
//    // console.log('parsedUrl');
//    // console.log(parsedUrl);
//
//    // // get page name
//    // const pageName = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
//    const pageName = pathname.replace(/^\/+|\/+$/g, '');
//    console.log('http request, page: ' + pageName);


    if (pathname === '/') {
        let obj = require('./date_range_5_5.js');
        let index = (obj) => eval("`" + fs.readFileSync('./layout/index.html') + "`");
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(index(obj.obj));
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
        && Date.parse(from) >= Date.parse(config.FROM)
        && Date.parse(from) <= Date.parse(config.TO)
        && Date.parse(to) >= Date.parse(config.FROM)
        && Date.parse(to) <= Date.parse(config.TO)
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
          }
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
    } else {
      res.writeHead(404).end();
    }

////     res.setHeader('Content-Type', 'text/html');
//// //     // TODO doc about error handling and cases
//// //     // TODO convention for parameters
//// //     // price.error
//// //     // when trying to save user input, need to perform a sanitize procedure to prevent code injection
//// //     //res.write(index({lower: {value: params.lower, error: 'Expected that: Upper &gt; Lower'}}));
////     res.write(index(data));
//
//
//    // res.on("change", (event) => {
//    //     // get value from input
//    //     const modeHtml = event.target.value;
//    //
//    //     params.grid = modeHtml;
//    //
//    //     res.send(params);
//    // });
//
//    res.end();
////
////     //res.end('gridstat site', 'utf-8');
////   }
////   // TODO create page 404
});

server.listen(8080);

