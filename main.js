const express = require('express');
const app = express();
const fs = require('fs');
const scrapeMAL = require("./functions/scrapeMAL");
const jsonReader = require("./functions/jsonReader");
const getDate = require("./functions/getDate");

app.use(express.static('static'));

app.get('/:data', (req,res)=>{

    fs.readFile('./accessed.txt', 'utf8', (err, data) => {
        if (err) throw err;

        const date = getDate();

        if (date != data){
            scrapeMAL();
            fs.writeFile('./accessed.txt', date, (err) => {
                if (err) console.log('Error writing file:', err);
            });
            console.log("finished scraping MAL!");
        }
        else {
            console.log("didn't scrape MAL");
        }
    });
    

    jsonReader('./db.json', (err, data)=>{ 
        if (err) throw err;

        let db = [];
        let temp = {};
        data.forEach(item => {
            temp["name"] = item.name;
            temp["score"] = item.score;
            temp["imageURL"] = item.imageURL;
            temp["day"] = item.day;
            temp["description"] = item.description;
            temp["url"] = item.url;
            temp["popularity"] = item.popularity;
            db.push(temp);
            temp = {};
        })
        res.send(db);
    });

});

app.get('/', (req,res)=>{ 
   res.sendFile('index.html');
});


app.listen(process.env.PORT || 5500, () => {
    console.log(`App listening at http://localhost:${5500}`);
})
