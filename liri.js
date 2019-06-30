require("dotenv").config();

var fs = require("fs");
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var type = process.argv[2];
var search = process.argv.slice(3).join(" ");
var divider = "\n------------------------------------------------------------\n\n";

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

function song() {
  if (search === "") {
    search = "Ace of Base The Sign";
  }
  spotify
    .search({ type: 'track', query: search, limit: 1 })
    .then(function (response) {
      var track = response.tracks.items;
      var info = [
        "Artist: " + track[0].artists[0].name,
        "Song: " + track[0].name,
        "Link: " + track[0].preview_url,
        "Album: " + track[0].album.name
      ].join("\n\n");

      fs.appendFile("log.txt", info + divider, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log(info);
      });
    })
    .catch(function (err) {
      console.log(err);
    });
}

function movie() {
  if (search === "") {
    search = "Mr. Nobody";
  }
  var URL = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";
  axios.get(URL).then(function (response) {
    var data = response.data;
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

    fs.appendFile("log.txt", info + divider, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log(info);
    });
  }).catch(function (err) {
    console.log(err);
  });
}