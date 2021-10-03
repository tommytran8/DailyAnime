const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require('cheerio');
const getDate = require("./getDate");

async function animeParse(url) {
  const response = await fetch(url);
  return response.text()
    .then((html) => {
      const $ = cheerio.load(html);


      let day = "Unknown";
      for (const [key, value] of Object.entries($('.borderClass > div > .spaceit_pad').children())) {
        let temp = $('.borderClass > div > .spaceit_pad').children()[key];
        if (temp.next && temp.next.data && temp.next.data.includes("days")) {
          day = temp.next.data.trim();
          break;
        }
      }
      // console.log(day);
      
      return {
        name: $('.title-name').text(),
        score: $('.score-label').text(),
        imageURL: $('.borderClass img:nth-child(1)').attr('data-src'),
        day: day,
        description:  $('.js-scrollfix-bottom-rel > table > tbody > tr > td > p').text(),
        url: url,
        retrievedAt: getDate()
      }
    })
    .catch(function(err) {
      console.error("error in converting scraped data to json:" , err);
      return err;
    })
}

module.exports = animeParse;