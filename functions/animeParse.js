const rp = require('request-promise');
const $ = require('cheerio');

function animeParse(url) {
  return rp(encodeURI(url))
    .then((html) => {
      return {
        name: $('.title-name' , html).text(),
        score: $('.score-label', html).text(),
        imageURL: $('.borderClass img:nth-child(1)',  html).attr('data-src'),
        day: $('.borderClass > div > .spaceit',  html).children()[2].next.data.trim(),
        description:  $('.js-scrollfix-bottom-rel > table > tbody > tr > td > p', html).text(),
        url: url,
        popularity: $('.score', html).attr("data-user")
      }
    })
    .catch(function() {
      console.log("error in converting scraped data to json");
    })
}

module.exports = animeParse;