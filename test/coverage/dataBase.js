
// var mongodb = require('mongo-mock');
// mongodb.max_delay = 0;//you can choose to NOT pretend to be async (default is 400ms)
// var MongoClient = mongodb.MongoClient;
// MongoClient.persist="mongo.js";//persist the data to disk
// const {} = require('../../devFolders/dummyDataFunctions')

// // Connection URL
// var url = 'mongodb://localhost:27017/test';
// // Use connect method to connect to the Server
// exports.mongo = MongoClient;

// // Connection URL
// // Use connect method to connect to the Server
// exports.mongo = MongoClient.connect(url, {}, async function(err, client) {
//   var db = client.db();
//   // Get the documents collection
//   var collection = db.collection('question-answers');
//   // Insert some documents
//   var docs = [ {a : 1}, {a : 2}, {a : 3}];
//   console.log(collection.name)
//   const gg = await collection.insertOne({a:'2'});
//   const ff = await collection.findOne({a:'2'});
