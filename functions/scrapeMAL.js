async function scrapeMAL(db, callback){
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const cheerio = require('cheerio');
  const fs = require('fs');
  const url = 'https://myanimelist.net/anime/season';
  const response = await fetch(url);
  

  const animeParse = require('./animeParse');
  const collection = db.collection('documents');


  await response.text()
    .then((html)=>{
      //success!
      const animeURLs = [];
      const $ = cheerio.load(html);
      // console.log($('.h2_anime_title > .link-title')[1].attribs.href);
      const length =  $('.h2_anime_title').length;
      for (let i = 0; i < length; i++) {
      animeURLs.push($('.h2_anime_title > .link-title')[i].attribs.href);
      }
      // return Promise.all( //for small sample testing 
      //   animeURLs.slice(0,2).map((url) =>{
      //       return animeParse(url);
            
      //   })
      // );
      return Promise.all(  //for deployment
          animeURLs.map((url) =>{
              return animeParse(url);
          })
      );
     
  })
  .then(function(titles) { //recieves the return and prints the Promise.all
    try {
      // console.log(titles);
      collection.insertMany( titles, function(err, result) {
        console.log("Finished scraping MAL, adding data to database");
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