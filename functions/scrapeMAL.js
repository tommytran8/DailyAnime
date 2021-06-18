async function scrapeMAL(db, callback){
  const rp = require('request-promise');
  const cheerio = require('cheerio');
  const fs = require('fs');
  const url = 'https://myanimelist.net/anime/season';
  

  const animeParse = require('./animeParse');
  const collection = db.collection('documents');


  await rp(url)
  .then( (html) => {
      //success!
      const animeURLs = [];
      const $ = cheerio.load(html);
      // console.log($('.h2_anime_title > .link-title')[1].attribs.href);
      const length =  $('.h2_anime_title').length;
      for (let i = 0; i < length; i++) {
      animeURLs.push($('.h2_anime_title > .link-title')[i].attribs.href);
      }
      return Promise.all(
          animeURLs.map((url) =>{
              return animeParse(url);
          })
      );
      // return Promise.all( //for testing
      //   animeURLs.slice(0,2).map((url) =>{
      //       return animeParse(url);
      //   })
      // );
     
  })
  .then(function(titles) { //recieves the return and prints the Promise.all
    try {
      collection.insertMany( titles, function(err, result) {
        console.log("Finished scraping MAL");
        callback(titles);
      });    
    } catch (error) {
        console.error(error);
    }
  })
  .catch(function(e){
      console.error(`Error in scraping: ${e}`);
  });
}

module.exports = scrapeMAL;