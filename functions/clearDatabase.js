
const clearDatabase = function(db, date, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Delete document where a is 3
    
    collection.deleteMany({ retrievedAt : date }, function(err, result) {
      console.log(`Removed the data retrieved on ${date}`);
      callback(result);
    });    
  }

  module.exports = clearDatabase;