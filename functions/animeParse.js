const rp = require('request-promise');
const cheerio = require('cheerio');
const getDate = require("./getDate");

function animeParse(url) {
  return rp(encodeURI(url))
    .then((html) => {
      const $ = cheerio.load(html);
      return {
        name: $('.title-name').text(),
        score: $('.score-label').text(),
        imageURL: $('.borderClass img:nth-child(1)').attr('data-src'),
        day: $('.borderClass > div > .spaceit').children()[2].next.data.trim(),
        description:  $('.js-scrollfix-bottom-rel > table > tbody > tr > td > p').text(),
        url: url,
        retrievedAt: getDate()
      }
    })
    .catch(function(e) {
      console.error("error in converting scraped data to json");
      return e;
    })
}

module.exports = animeParse;