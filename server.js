var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var mdb = require('moviedb')('dfd83c2c0bebc32bae01fc2c89be057e');
var cors = require('cors')

var app = express();

app.use(cors()) // For communication between ports on localhost

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

app.use(bodyParser.json());

var collection;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://t7gafl00:Password1@cluster0-q8bck.mongodb.net/test?retryWrites=true&w=majority" // replace the uri string with your connection string.
MongoClient.connect(uri, function (err, client) {
  if (err) {
    console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
  }

  console.log('Connected...');
  collection = client.db("watchlist_db").collection("movies_collection");

  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ "error": message });
}

/***** TMDB *****/
/*
app.get("/api/discoverMovie/:_page", function(req, res) {  // Discover movies sorted by popularity descending
  mdb.discoverMovie({ page: req.params._page }, function(err, result){
    console.log(res);
    if (err) {
      handleError(res, err.message, "Failed to get movies");
    } else { 
      res.status(200).json(result); // return whole reponse as JSON, 
      // res.status(200).json(result.results); // return "results" array from response
    }
  });
});
*/
app.get("/api/discoverMovie/:_genre/:_page", function (req, res) {  // Discover movies based on genre sorted by popularity descending 
  mdb.discoverMovie({ with_genres: req.params._genre, page: req.params._page }, function (err, result) {
    console.log(res);
    if (err) {
      handleError(res, err.message, "Failed to get movies");
    } else {
      res.status(200).json(result); // return whole reponse as JSON, 
    }
  });
});

app.get("/api/movieVideos/:id", function (req, res) {  // Get the videos that have been added to a movie.
  mdb.movieVideos({ id: req.params.id }, function (err, result) {
    console.log(res);
    if (err) {
      handleError(res, err.message, "Failed to get videos");
    } else {
      res.status(200).json(result);
    }
  });
});

/* UNUSED BUT TESTED WORKING, FOR FUTURE FUNCTIONALITIES

app.get("/api/movieInfo/:id", function(req, res) {  // Get the primary information about a movie.
  mdb.movieInfo({id: req.params.id}, function(err, result){
    console.log(res);
    if (err) {
      handleError(res, err.message, "Failed to get movie");
    } else { 
      res.status(200).json(result);
    }
  });
});

app.get("/api/movieImages/:id", function(req, res) {  // Get the images that belong to a movie.
  mdb.movieImages({id: req.params.id}, function(err, result){
    console.log(res);
    if (err) {
      handleError(res, err.message, "Failed to get movie");
    } else { 
      res.status(200).json(result);
    }
  });
});

app.get("/api/searchMovie/:name", function(req, res) {  // Search for a movie.
  mdb.searchMovie({query: req.params.name}, function(err, result){
    console.log(res);
    if (err) {
      handleError(res, err.message, "Failed to get movie");
    } else { 
      res.status(200).json(result);
    }
  });
});
*/

/***** MongoDB *****/

app.get("/api/watchlist", function (req, res) { // GET: finds all movies on watchlist
  collection.find({}).sort( { createDate: -1 } ).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get watchlist.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/watchlist", function (req, res) { // POST: creates a new movie in watchlist
  var newWatchItem = req.body;
  newWatchItem.createDate = new Date();
  collection.insertOne(newWatchItem, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new item in watchlist.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.delete("/api/watchlist/:id", function (req, res) { // DELETE: deletes movie by id
  collection.deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete movie from watchlist");
    } else {
      res.status(204).end();
    }
  });
});

/* Correct routing for direct access to urls on Heroku or page refresh,
   for ex: https://boiling-plains-03142.herokuapp.com/discoverMovie/7
   which otherwise returns Cannot GET...
   Must be added after the other routes */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/*
// Redirect wrong urls to index.html
app.get('*',function (req, res) {
  res.redirect('/');
});*/