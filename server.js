const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

//let index = require('./layout/index.js');

var index = (obj) => eval("`" + fs.readFileSync('./layout/index.html') + "`");

const server = http.createServer((req, res) => {
  console.log('https request');
  console.log(req.headers); // TODO try catch for internal server error
  // TODO find way how to make request to https server with command line utils like telnet, netcat, etc
  // TODO undertand behaviour of redirect if domain don't match
  // TODO check if host www.gridstat.softevol.net or gridstat.softevol.net
  if(req.headers.host.startsWith('www.')) { // TODO check if host missing
    console.log('if');
    res.writeHead(301, { Location: `https://${req.headers.host.substring(4)}${req.url}` });
    res.end();
  } else {
    // TODO error not must crash server
    let { /*href,*/ pathname, /*search,*/ query } = url.parse('https://' + req.headers.host + req.url);
    //console.log('pathname: ' + pathname);
    //console.log('query: ' + query);

    const params = querystring.decode(query);
    console.log('params: ' + JSON.stringify(params));

    let data = {
      lower: {}
    };

    if(params.lower == undefined) {
      data.lower.error = 'Expected value';
    }

    /**
     * TODO (for next project) consider automatic validation and status message generation using JSON Schema
     * greater than https://github.com/json-schema-org/json-schema-spec/issues/51
     * review for schema generation https://github.com/fastify/fluent-json-schema
     * documentation https://json-schema.org/draft/2020-12/json-schema-validation
     */

    /**
     * TODO nameing, maybe better structure
     * {
     *   lower: {
     *     value: Number | undefined,
     *     status: {
     *       integer:      hidden | pass | not applicalbe | fail
     *       ge1000:       hidden | pass | not applicable | fail
     *       multiple_1e3: hidden | pass | not applicable | fail
     *     }
     *   },
     *   upper: {
     *     value: Number | undefined,
     *     status: {
     *       integer:      undefined | 'pass' | 'not applicalbe' | 'fail'
     *       ge2000:       undefined | pass | not applicable | fail
     *       multiple_1e3: undefined | pass | not applicable | fail
     *       gt_lower:     undefined | pass | not applicable | fail
     *     }
     *   }
     * }
     *
     */

     let obj = {
       lower: {
       //  value: Number | undefined,
       //  status: {
       //    integer:      hidden | pass | not applicalbe | fail
       //    ge1000:       hidden | pass | not applicable | fail
       //    multiple_1e3: hidden | pass | not applicable | fail
       //  }
       },
       upper: {
         //value: Number | undefined,
         status: {
           integer: 'fail',
           ge2000: 'na',
           multiple_1e3: 'na',
           gt_lower: 'na'
         }
       }
     };

    //const params = querystring.decode(search[0] === '?' ? search.substring(1) : search);
    //res.writeHead(200, { 'Content-Type': 'text/html' });
    res.setHeader('Content-Type', 'text/html');
    // TODO doc about error handling and cases
    // TODO convention for parameters
    // price.error
    // when trying to save user input, need to perform a sanitize procedure to prevent code injection
    //res.write(index({lower: {value: params.lower, error: 'Expected that: Upper &gt; Lower'}}));
    res.write(index(obj));
    res.end();

    //res.end('gridstat site', 'utf-8');
  }
  // TODO create page 404
});

server.listen(8080/*, hostname*/);

