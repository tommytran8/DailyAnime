function scrapeMAL(){
  const rp = require('request-promise');
  const $ = require('cheerio');
  const fs = require('fs');
  const url = 'https://myanimelist.net/anime/season';

  const animeParse = require('./animeParse');


  rp(url)
  .then((html) => {
      //success!
      const animeURLs = [];
      const length =  $('.h2_anime_title', html).length;
      for (let i = 0; i < length; i++) {
      animeURLs.push($('.h2_anime_title > .link-title', html)[i].attribs.href);
      }
      return Promise.all(
          animeURLs.map((url) =>{
              return animeParse(url);
          })
      );
  })
  .then(function(titles) { //recieves the return and prints the Promise.all
    fs.writeFile('./db.json', JSON.stringify(titles), (err) => {
    if (err) console.log('Error writing file:', err);
    });
  })
  .catch(function(){
      console.log("error in scraping");
  });
}

module.exports = scrapeMAL;