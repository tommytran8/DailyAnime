async function scrapeMAL(db, callback){
  const rp = require('request-promise');
  const $ = require('cheerio');
  const fs = require('fs');
  const url = 'https://myanimelist.net/anime/season';
  

  const animeParse = require('./animeParse');
  const collection = db.collection('documents');


  await rp(url)
  .then( (html) => {
      //success!
      const animeURLs = [];
      const length =  $('.h2_anime_title', html).length;
      for (let i = 0; i < length; i++) {
      animeURLs.push($('.h2_anime_title > .link-title', html)[i].attribs.href);
      }
      return Promise.all(
          animeURLs.slice(0,30).map((url) =>{
              return animeParse(url);
          })
      );
      // return Promise.all( //for testing
      //   animeURLs.slice(0,3).map((url) =>{
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
  .catch(function(){
      console.error("Error in scraping");
  });
}

module.exports = scrapeMAL;