const { FROM, TO }= require('../config.js');

// https://stackoverflow.com/a/35413963

function iso(date) {
  //console.log('date: ' + date);
  //console.log('typeof date: ' + (typeof date));
  if(typeof date != 'string') {
    return false;
  }
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if(!date.match(regEx)) {
    //console.log('\tnot match \/^\\d{4}-\\d{2}-\\d{2}$\/');
    return false;  // Invalid format
  }
  var d = new Date(date);
  //console.log('\tdate: ' + d);

  //var t = d.getTime();
  //console.log('\ttime: ' + t);

  if(isNaN(d)) {
    return false;
  }

  //console.log('\tiso: ' + d.toISOString().slice(0,10));
  return d.toISOString().slice(0,10) === date;
}

function range(date) {
  return date >= FROM && date <= TO
}

/* Example Uses */
//console.log('a000-00-00: ' + iso("a000-00-00") + '\n');  // false
//console.log('0000-00-00: ' + iso("0000-00-00") + '\n');  // false
//console.log('0001-01-01: ' + iso("0001-01-01") + '\n');  // true
//console.log('2015-01-32: ' + iso("2015-01-32") + '\n');  // false
//console.log('2016-11-25: ' + iso("2016-11-25") + '\n');  // true
//console.log('1970-01-01: ' + iso("1970-01-01") + '\n');  // true = epoch
//console.log('1969-12-31: ' + iso("1969-12-31") + '\n');  // < epoch
//console.log('2016-02-29: ' + iso("2016-02-29") + '\n');  // true = leap day
//console.log('2013-02-29: ' + iso("2013-02-29") + '\n');  // false = not leap day

function number(str) {

  //console.log('number(\'' + str + '\')');

  if(typeof str != 'string') {
    //console.log('\tnot a string');
    return false;
  }

  // Number('') return 0
  if(str.valueOf() == '') {
    //console.log('\tempty string');
    return false;
  }

  // Number(' ' | '\t' | '\r' | '\r\n' | '  ' | ... ) return 0
  if(str.valueOf() != str.trim().valueOf()) {
    //console.log('\tstring contain whitespaces');
    return false;
  }

  let n = Number(str);
  //console.log('\tn:', n);
  if(Number.isNaN(n)) {
    //console.log('\tisNaN()');
    return false;
  }

  return true;

}

//console.log(number({}));
//console.log();
//console.log(number(''));
//console.log();
//console.log(number(' '));
//console.log();
//console.log(number('\t1'));
//console.log();
//console.log(number('NaN'));

function isValidMode(str) {

  console.log('isValidMode(\'' + str + '\')');

  if(typeof str != 'string') {
    console.log('\tnot a string');
    return false;
  }

  if(str.valueOf() != 'arithmetic') {
    console.log('\tmode is not arithmetic');
    return false;
  }

  return true;

}

//console.log(isValidMode(undefined));
//console.log();
//console.log(isValidMode(null));
//console.log();
//console.log(isValidMode('geometric'));
//console.log();
//console.log(isValidMode('arithmetic'));
//console.log();
//console.log(isValidMode(' arithmetic'));
//console.log();

function isValidGrids(str) {

  //console.log('isValidGrids(\'' + str + '\')');

  if(typeof str != 'string') {
    //console.log('\tnot a string');
    return false;
  }

  // Number('') return 0
  if(str.valueOf() == '') {
    //console.log('\tempty string');
    return false;
  }

  // Number(' ' | '\t' | '\r' | '\r\n' | '  ' | ... ) return 0
  if(str.valueOf() != str.trim().valueOf()) {
    //console.log('\tstring contain whitespaces');
    return false;
  }

  // for case like 1.0
  if(str.indexOf('.') != -1) {
    //console.log('\tstring contain .');
    return false;
  }

  let n = Number(str);
  //console.log('\tn:', n);
  if(Number.isNaN(n)) {
    //console.log('\tisNaN()');
    return false;
  }

  if(!Number.isInteger(n)) {
    //console.log('\tnot at inteter');
    return false;
  }

  if(!(n >= 2 && n <= 20)) {
    //console.log('\tnot in range [2,20]');
    return false;
  }

  return true;

}

//console.log(isValidGrids({}));
//console.log();
//console.log(isValidGrids(''));
//console.log();
//console.log(isValidGrids(' '));
//console.log();
//console.log(isValidGrids('\t2'));
//console.log();
//console.log(isValidGrids('NaN'));
//console.log();
//console.log(isValidGrids('10.2'));
//console.log();
//console.log(isValidGrids('10.0'));
//console.log();
//console.log(isValidGrids('1'));
//console.log();
//console.log(isValidGrids('21'));
//console.log();
//console.log(isValidGrids('2'));
//console.log();
//console.log(isValidGrids('20'));
//console.log();

// TODO generalize code
function isNumber(str) {

  //console.log('isValidPriceRangeBoundary(\'' + str + '\')');

  if(typeof str != 'string') {
    //console.log('\tnot a string');
    return false;
  }

  // Number('') return 0
  if(str.valueOf() == '') {
    //console.log('\tempty string');
    return false;
  }

  // Number(' ' | '\t' | '\r' | '\r\n' | '  ' | ... ) return 0
  if(str.valueOf() != str.trim().valueOf()) {
    //console.log('\tstring contain whitespaces');
    return false;
  }

  let n = Number(str);
  //console.log('\tn:', n);
  if(Number.isNaN(n)) {
    //console.log('\tisNaN()');
    return false;
  }

  return true;

}

module.exports = {
  iso,
  range,
  number,
};

