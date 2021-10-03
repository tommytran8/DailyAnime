const express = require('express');
const app = express();
const fs = require('fs');
const scrapeMAL = require("./functions/scrapeMAL-local");
const jsonReader = require("./functions/jsonReader");
const getDate = require("./functions/getDate");

app.use(express.static('static'));

app.get('/:data', (req,res)=>{

    fs.readFile('./accessed.txt', 'utf8', (err, data) => {
        const date = getDate();
        if (err || date != data){
            updateData(date, (err)=> {
                if (!err) readingJSON();
            });
            
        }
        else {
            console.log("didn't need to scrape MAL");
            readingJSON();
        }
    });


    async function updateData(date, callback){
        await scrapeMAL((err)=>{
            if(!err) {
                fs.writeFile('./accessed.txt', date, (err) => {
                    if (err) console.log('Error writing file:', err);
                });
                console.log("finished scraping MAL!");
                callback(false);
            }
            else callback(err)
        });
    }
    
    function readingJSON() {
        jsonReader('./db.json', async (err, data)=>{ 
            if (err) {
                console.log("error reading db.json:", err);
            }
            let db = [];
            readingData(db,data);
            res.send(db);
        });
    }
    
    function readingData(db,data){
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
    }
});

app.get('/', (req,res)=>{ 
   res.sendFile('index.html');
});


app.listen(process.env.PORT || 5500, () => {
    console.log(`App listening at http://localhost:${5500}`);
})

