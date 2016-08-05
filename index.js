#! /usr/bin/env node

/**
 * @author Philip YS <wbvcos@gmail.com>
 */

const program = require('commander');
const APIcalls = require('./lib/calls');

program
  .version('0.1.0')
  .option('-e <word>', 'English to Korean')
  .option('-k <word>', 'Korean to English')
  .option('-u <word>', 'Urban dictionary')
  .parse(process.argv);

let expression = process.argv[2];

switch(expression){
  case '-e':
    APIcalls.Dictionary(expression, program.E);
    break;
  case '-k':
    APIcalls.Dictionary(expression, program.K);
    break;
  case '-u':
    APIcalls.Dictionary(expression, program.U);
    break;
  default:
    console.log("wrong expression");
    break;
}
