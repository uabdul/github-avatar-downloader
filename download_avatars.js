var request = require('request');
var token = require('./secrets.js');
var fs = require('fs');
var repoOwner = process.argv[2];
var repoName = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

// If a valid repo owner and name not provided, this function prompts the user
//for correct input and terminates the application. If correct inputs provided,
//the function submits the request and parses the result into an array.
function getRepoContributors(repoOwner, repoName, cb) {
  if (!repoName || !repoOwner) {
    console.log("Please provide a valid repo owner and repo name. Your inputs should be in the following format: node download_avatars.js <repo owner> <repo name>")
    return;
  } else {
    var options = {
      url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
      headers: {
        'User-Agent': 'request',
        'Authorization': "token " + token['GITHUB_TOKEN']
      }
    };

    request(options, function(err, res, body){
      var arr = JSON.parse(body);
      parseData(err, arr);
    });
  }
}

//If a folder named /avatars/ does not exist, creates a folder.
//For each user, requests and writes display image.
function downloadImageByURL(url, filePath) {
  if (!fs.existsSync("./avatars/")) {
    fs.mkdirSync("./avatars/");
  }
  var finalFilePath = "./avatars/" + filePath + ".png"
  request.get(url).pipe(fs.createWriteStream(finalFilePath));
}


//Iterates through each object in the array and identifies the URL and filepath,
//and calls back the downloadImagesByURL function.
function parseData(err, result) {
  console.log("Errors:", err);
  result.forEach(function (object) {
    var url = object['avatar_url'];
    var filePath = object['login'];
    downloadImageByURL(url, filePath);
  });
  console.log("The avatars have been downloaded! Please check the /avatars folder.")
}

//Initiates the program using inputs provided by the Node user.

getRepoContributors(repoOwner, repoName);

