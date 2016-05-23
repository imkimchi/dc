#! /usr/bin/env node

let request = require('request');
let cheerio = require('cheerio');
var program = require('commander');

let daum = "http://alldic.daum.net/search.do?q=";
let urban = "http://www.urbandictionary.com/define.php?term="

let defaultHeader = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With'
};

var Dictionary = function(uri, query) {
    request(uri + query, function(err, res, html) {
        if (!err && res.statusCode == 200) {
          let $ = cheerio.load(html);
          let translated;

          if (uri === daum) {
            translated = $('.txt_search').first().text();
            if (!translated) translated = 'Not Found';
            console.log("\n" + translated + "\n");
            }

          if (uri === urban) {
            translated = $('.meaning').first().text();
                console.log(translated);
            }
        }
    })
};

program
    .version('0.0.1')
    .option('-e, --etk [query]', 'English to Korean')
    .option('-u, --urban [query]', 'show urban dictionary')
    .parse(process.argv);

if (process.argv[3]) {
    if (program.etk) Dictionary(daum, program.etk);
    if (program.urban) Dictionary(urban, program.urban);
} else {
    console.log("\n  error: no arguments passed \n");
}
