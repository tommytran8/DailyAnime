const express = require('express');
const app = express();
const scrapeMAL = require("./functions/scrapeMAL");
const clearDatabase = require("./functions/clearDatabase");
const getDatabase = require("./functions/getDatabase");
const getDate = require("./functions/getDate");

app.use(express.static('static'));

// Start up Database
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI || require("./env.json").URI;
const dbName = 'DailyAnime';
const client = new MongoClient(url);

const favicon = require('serve-favicon'), path = require("path");

app.use(favicon(path.join(__dirname + '/favicon.ico')));

app.listen(process.env.PORT || 5500, () => {
  console.log(`App listening at http://localhost:${5500}`);
})


// Connect to the Database server
client.connect(function(err) {
  console.log("Connected successfully to Database server");
  const db = client.db(dbName);

  //retrieve data from server
  getDatabase(db, (docs)=>{
    //check if data is older than a day
    if (docs && docs[0] ? docs[0]["retrievedAt"] == getDate() : false){
      console.log("Didn't need to scrape");
      app.get('/:data', (req,res)=>{
        res.send(docs);
      });
      app.get('/', (req,res)=>{ 
        res.sendFile('index.html');
      });
      client.close();
    }
    else {
      console.log("Starting scraping process...");
      if (docs && docs[0]){
        //use existing database
        app.get('/:data', (req,res)=>{
          res.send(docs);
        });
        app.get('/', (req,res)=>{ 
          res.sendFile('index.html');
        });

        // NEED TO MAKE THIS SECTION ASYNC

        //scrape for updated data
        scrapeMAL(db, function(data){
          //update database after scraping
          clearDatabase(db, docs[0]["retrievedAt"],function(){
            client.close();
          });
        });
        
      }
      else {
        //if data is empty, just start scraping
        scrapeMAL(db, function(data){
          app.get('/:data', (req,res)=>{
            res.send(data);
          });
          app.get('/', (req,res)=>{ 
            res.sendFile('index.html');
          });
          client.close();
        });
      }
    }
  });
});
