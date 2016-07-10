#! /usr/bin/env node

/**
 * @author Philip YS <wbvcos@gmail.com>
 */

const request = require('request');
const cheerio = require('cheerio');
const program = require('commander');
const chalk = require('chalk');

let defaultDaum = "http://dic.daum.net";
let daumDic = defaultDaum + "/search.do?q=";
let urban = "http://www.urbandictionary.com/define.php?term=";

const Dictionary = function(uri, query) {
  request(uri + query, function(err, res, html) {
    if (!err && res.statusCode == 200) {
      let $ = cheerio.load(html);
      if (uri === daumDic) daumSearch($, query);
      if (uri === urban) urbanSearch($, query);
    }
  })
};

function daumSearch($, query) {
  detailURL = $('.txt_cleansch').attr('href');
  request(defaultDaum + detailURL, function(err, res, html){
    if (!err && res.statusCode == 200) {
      let $ = cheerio.load(html);
      let words = $('.inner_top .list_mean .txt_mean');
      let wordtype = [];

      $('.tit_sort').each(function(i) {
        wordtype.push($(this).text());
      });

      console.log(`\n${query} ${wordtype} \n`);
      words.each(function(i) {
        console.log(`${i+1}. ${$(this).text()}`);
      });
    } else {
      console.log("There aren't any definitions for %s", query);
      //chalk.red("There aren't any definitions for"+ query);
  }
});
}

function urbanSearch($, query) {
  let definitions = $('.meaning');
  definitions.each(function(i) {
    if(i<2) {
      let sentence = $(this).text().replace(/\n/g, "");
      console.log(`\n${i+1}. ${sentence}\n`);
    }
  })
};


program
  .version('0.0.1')
  .option('-e, --etk [query]', 'English to Korean')
  .option('-u, --urban [query]', 'Urban dictionary')
  .parse(process.argv);

if (process.argv[3]) {
  if (program.etk) Dictionary(daumDic, program.etk);
  if (program.urban) Dictionary(urban, program.urban);
} else {
  console.log(`\n  error: no arguments passed \n`);
}
