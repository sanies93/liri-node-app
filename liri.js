// DEPENDENCIES
// Read and set environment variables
require("dotenv").config();

var fs = require("fs"); // Import the FS package for read/write
var axios = require("axios"); // Import the axios npm package
var keys = require("./keys.js"); // Import the API keys
var moment = require("moment"); // Import the moment npm package
var Spotify = require("node-spotify-api"); // Import the node-spotify-api NPM package

var spotify = new Spotify(keys.spotify); // Initialize the spotify API client using client id and secret

var type = process.argv[2]; // First Input command line argument
var search = process.argv.slice(3).join(" "); // Second input command line argument
var divider = "\n------------------------------------------------------------\n\n";

// Determine which command is executed
switch (type) {
  case "concert-this":
    concert();
    break;

  case "spotify-this-song":
    song();
    break;

  case "movie-this":
    movie();
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;

  default:
    console.log("\n-------------------\n");
    console.log("\n-------------------\n");
    console.log("Enter command: \n'concert-this <artist/band name here>' \n'spotify-this-song <song name here>' \n'movie-this <movie name here>' \n'do-what-it-says'");
};

// Function for concert search
function concert() {
  var URL = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
  axios.get(URL).then(function (response) {
    var data = response.data;
    console.log(divider);
    console.log(divider);
    var info = [
      "Venue: " + data[0].venue.name,
      "City: " + data[0].venue.city,
      "Date: " + moment(data[0].datetime).format("MM/DD/YYYY") // Use moment to format the date
    ].join("\n\n");

    // Push concert data to log text file
    fs.appendFile("log.txt", info + divider, function (err) {
      if (err) throw err;
      console.log(info);
    });
  }).catch(function (err) {
    console.log(err);
  });
}

// Function for song search
function song() {
  if (search === "") {
    search = "Ace of Base The Sign"; // Defaults to this song if search argument is blank
  }
  spotify
    .search({ type: 'track', query: search, limit: 1 })
    .then(function (response) {
      var track = response.tracks.items;
      console.log(divider);
      console.log(divider);
      var info = [
        "Artist: " + track[0].artists[0].name,
        "Song: " + track[0].name,
        "Link: " + track[0].preview_url,
        "Album: " + track[0].album.name
      ].join("\n\n");

      // Push concert data to log text file
      fs.appendFile("log.txt", info + divider, function (err) {
        if (err) throw err;
        console.log(info);
      });
    })
    .catch(function (err) {
      console.log(err);
    });
}

// Function for movie search
function movie() {
  if (search === "") {
    search = "Mr. Nobody"; // Defaults to this move if search argument is blank
  }
  var URL = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";
  axios.get(URL).then(function (response) {
    var data = response.data;
    console.log(divider);
    console.log(divider);
    var info = [
      "Movie: " + data.Title,
      "Year: " + data.Year,
      "IMDB Rating: " + data.imdbRating,
      "Rotten Tomatoes Rating: " + data.Ratings[1].Value,
      "Country: " + data.Country,
      "Language: " + data.Language,
      "Plot: " + data.Plot,
      "Actors: " + data.Actors
    ].join("\n\n");

    // Push concert data to log text file
    fs.appendFile("log.txt", info + divider, function (err) {
      if (err) throw err;
      console.log(info);
    });
  }).catch(function (err) {
    console.log(err);
  });
}

// Function for using the fs Node package to read the text inside of random.txt and use it to call one of LIRI's commands.
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) throw err;
    console.log(divider);
    console.log(divider);
    var dataFormatted = data.split(",");
    console.log(dataFormatted);
    type = dataFormatted[0];
    search = dataFormatted[1];
    switch (type) {
      case "concert-this":
        concert();
        break;

      case "spotify-this-song":
        song();
        break;

      case "movie-this":
        movie();
        break;
    }
  });
}