const express = require('express');
const app = express();
const scrapeMAL = require("./functions/scrapeMAL");
const clearDatabase = require("./functions/clearDatabase");
const getDatabase = require("./functions/getDatabase");
const getDate = require("./functions/getDate");

app.use(express.static('static'));

// Start up Database
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'DailyAnime';
const client = new MongoClient(url);

// Use connect method to connect to the Database server
client.connect(function(err) {
  console.log("Connected successfully to Database server");
  const db = client.db(dbName);

  //retrieve data from server
  getDatabase(db, (docs)=>{
    //check if data is older than a day
    if (docs[0] ? docs[0]["retrievedAt"] == getDate() : false){
      console.log("Didn't need to scrape");
      app.get('/:data', (req,res)=>{
        res.send(docs);
      });
      app.get('/', (req,res)=>{ 
        res.sendFile('index.html');
      });
      app.listen(process.env.PORT || 5500, () => {
          console.log(`App listening at http://localhost:${5500}`);
      })
      client.close();
    }
    else {
      console.log("Starting scraping process...");
      if (docs[0]){
        //remove data first before scraping
        clearDatabase(db, docs[0]["retrievedAt"],function(){
          scrapeMAL(db, function(data){
            app.get('/:data', (req,res)=>{
              res.send(data);
            });
            app.get('/', (req,res)=>{ 
              res.sendFile('index.html');
            });
            app.listen(process.env.PORT || 5500, () => {
                console.log(`App listening at http://localhost:${5500}`);
            })
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
          app.listen(process.env.PORT || 5500, () => {
              console.log(`App listening at http://localhost:${5500}`);
          })
          client.close();
        });
      }
    }
  });
});
