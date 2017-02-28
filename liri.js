
var keys = require('./keys.js'); //connects to keys.js stores dependencies as variable.
var Twitter = require('twitter'); //connects twitter
var spotify = require('spotify'); //connects spotify
var request = require('request'); //connect ajax
var fs = require('fs'); //reads files
var pick = function(caseData, functionData){//function for each terminal command that captures user input, and inform user of what to type in.
	switch(caseData) {
	    case 'my-tweets'://case 1: command to call Twitter
	        searchMyTweets();//function
	        break;
	    case 'spotify-this-song'://case 2: command to call Spotify
	    	spotifySongs();//function
	    	break;
	    case 'movie-this'://case 3: command to call OMDB API/JSON data
	    	getMovie(functionData);//function
	    	break;
	    case 'do-what-it-says'://case 4: command to call text file
	    	getText();//function
	    	break;  
	    default:
	    	//default response
	    	console.log("What do you want info on? A Movie? A Song? OR Eric Tucker's new Twitter account?");
	    }
	};
var searchMyTweets = function(){//seaching tweets via Twitter API
	var client = new Twitter(keys.twitterKeys);
	var params = {screen_name: 'erictuckerux'};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	  if (!error) {
	  	for (var i = 0; i < tweets.length; i++) {
	  		var tweetTime = tweets[i].created_at;
	  		var tweetText = tweets[i].text;
	  		console.log("  ")//empty
	  		console.log(tweetTime)
	  		console.log(tweetText)
	  		console.log("  ")//empty
		//Attempt to write tweets from my twitter account to log.txt
		var twitterData = "Tweet " + (i + 1) + " " + tweets[i].text + " " + tweets[i].created_at;
	    	fs.writeFile('log.txt', '\n' + twitterData + '\n', 'utf8', function(err) {
				if (err) throw err;
		  		console.log('Tweets are appended to log.txt');;
			});
			fs.writeFile('log.txt', '\n' , 'utf8', function(err) {
			if (err) throw err;
			});
		}
		}
	});
}
var getArtistNames = function(artist){//function to call on artists from Spotify API
	return artist.name;
}
var spotifySongs = function(song) {//function to get Spotify songs through API
	var song = process.argv[3];
	if (song == undefined) {
		song = "The sign"
	};
spotify.search({type: 'track', query: song}, function(err, data) {
		console.log(" ")//Empty
		console.log(" Results:  ")
		console.log(" ")//Empty
		console.log("Song: " + data.tracks.items[0].name)
		console.log("Album: " + data.tracks.items[0].album.name)
		var numOfArtists = data.tracks.items[0].artists.length
		var artistArray = []
		for (var i = 0; i < numOfArtists; i++) {
			artistArray.push(data.tracks.items[0].artists[i].name)
		}
		console.log("Artist: " + artistArray)
		console.log("URL: " + data.tracks.items[0].preview_url)
//attempt to write data from spotify to log.txt
		var spotifyData = "Song: " + data.tracks.items[0].name + '\n' + "Album: " + data.tracks.items[0].album.name + '\n' + "Artist(s): " + artistArray + '\n' + "Preview URL: " + data.tracks.items[0].preview_url + '\n';
		fs.writeFile('log.txt', '\n' + spotifyData + '\n', 'utf8', function(err) {
		if (err) throw err;
	  		console.log('Spotify data appended to log.txt');
		})	
	})
}
var getMovie = function(){//function to get the data from the OMDB movie API
	var movie = process.argv[3];//sets the default response
	//terminal command
	if (movie === undefined){//terminal command
		movie = " Mr. Nobody    ";
	};
var url = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&tomatoes=true&r=json";
	request(url, function(err, response, body){
		body = JSON.parse(body);
		console.log('Title: ' + body.Title);
		console.log('IMDB Rating: ' + body.imdbRating);
		console.log('Plot: ' + body.Plot);
		console.log('Actors: ' + body.Actors);
		console.log('Rotten Tomatoes Rating: ' + body.tomatoRating);
	    console.log('Rotton Tomatoes URL: ' + body.tomatoURL);
//attempt to inject data from OMDA into logtext
	    var movieData = "Title: " + body.Title + '\n' + "Year: " + body.Year + '\n' + "IMDB Rating: " + body.imdbRating + '\n' + "Plot: " + body.Plot + '\n' + "Actors: " + body.Actors + '\n' + "Rotten Tomatoes Rating: " + body.tomatoRating + '\n' + "Rotten Tomatoes URL: " + body.tomatoURL + '\n';
			fs.writeFile('log.txt', '\n' + movieData + '\n', 'utf8', function(err) {
				if (err) throw err;
		  		console.log('Movie data appended to log.txt');
			});	
	});
}
var getText = function(){//function for random text
fs.readFile('random.txt', 'utf8', function(err, data){
console.log(data);
var dataArr = data.split(',')//split data, declare variables	
if (dataArr.length == 2){
pick(dataArr[0], dataArr[1]); //if multi-word search term, add.
}else if (dataArr.length == 1){
pick(dataArr[0]);
}
});
};
var runThis = function(argOne, argTwo){ //assigns argV to runThis variable
	pick(argOne, argTwo);
};
runThis (process.argv[2], process.argv[3]); //Runs when the javascript file is loaded
//process[2] choses action, process[3] as search parameter for spotify or movie.