var request = require('request');
var token = require('./secrets.js');
var fs = require('fs');
var repoOwner = process.argv[2];
var repoName = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

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

function downloadImageByURL(url, filePath) {
  if (!fs.existsSync("./avatars/")) {
    fs.mkdirSync("./avatars/");
  }
  var finalFilePath = "./avatars/" + filePath + ".png"
  request.get(url).pipe(fs.createWriteStream(finalFilePath));
}


function parseData(err, result) {
  console.log("Errors:", err);
  result.forEach(function (object) {
    var url = object['avatar_url'];
    var filePath = object['login'];
    downloadImageByURL(url, filePath);
  });
  console.log("The avatars have been downloaded! Please check the /avatars folder.")
}

getRepoContributors(repoOwner, repoName);

