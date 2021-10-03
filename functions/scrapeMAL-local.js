
async function scrapeMAL(callback){
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const cheerio = require('cheerio');
    const fs = require('fs');
    const url = 'https://myanimelist.net/anime/season';
  
    const response = await fetch(url);
  
    const animeParse = require('./animeParse');
  
    await response.text()
    .then((html)=>{
        //success!
        const animeURLs = [];
        const $ = cheerio.load(html);
        const length =  $('.h2_anime_title').length;
        // console.log(length);
        for (let i = 0; i < length; i++) {
          animeURLs.push($('.h2_anime_title > .link-title')[i].attribs.href);
          // console.log(animeURLs[i]);
        }
        return Promise.all( //for small sample testing 
            animeURLs.slice(0,2).map((url) =>{
                return animeParse(url);
                
            })
          );
        return Promise.all(
            animeURLs.map((url) =>{
                return animeParse(url);
            })
        );
    })
    .then(function(titles) { //recieves the return and prints the Promise.all
      fs.writeFile('./db.json', JSON.stringify(titles), (err) => {
        console.log("Finished scraping MAL");
        if (err) {
          console.log('Error writing file:', err);
          callback(err);
        }
        else callback(false);
      });
    })
    .catch(function(err){
        console.log("error in request:", err);
        callback(err);
    });
  }
  
  module.exports = scrapeMAL;