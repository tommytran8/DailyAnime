const getDatabase = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
      console.log(`Retrieving stored data...`);
      callback(docs);
    });
  }

  module.exports = getDatabase;