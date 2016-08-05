const request = require('request');
const cheerio = require('cheerio');
const chalk = require('chalk');
const urlencode = require('urlencode');

let defaultDaum = "http://dic.daum.net";
let daumDicURL = defaultDaum + "/search.do?q=";
let urban = "http://www.urbandictionary.com/define.php?term=";
let engDic = "&dic=eng&search_first=Y";

exports.Dictionary = function(expression, query) {
  let uri = makeUri(expression);
  let completeURL = urlCheck(uri, query);
  request(completeURL, (err, res, html)=> {
    if (!err && res.statusCode == 200) {
      let $ = cheerio.load(html);
      if (uri === daumDicURL) DaumDic($, query, completeURL);
      if (uri === urban) urbanSearch($, query);
    }
  })
};

function DaumDic($, query, uri) {
  let detailURL = $('.txt_cleansch').attr('href');
  let completeURL = defaultDaum + detailURL;

  request(completeURL, function (err, res, html) {
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

function makeUri(expression) {
  if(expression === '-e' || expression === '-k'){
    return daumDicURL;
  } else {
    return urban;
  }
}

function EngCheck(query){
  if(query.match(/[a-z]/i)) return true;
  else return false;
}

function urlCheck(uri, query){
  let completeURL = uri + query;
  if(!EngCheck(query)){
    completeURL = uri+urlencode(query)+engDic;
  }
  return completeURL;
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
