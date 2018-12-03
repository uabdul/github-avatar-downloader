var request = require('request');
var token = require('./secrets.js');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': token['GITHUB_TOKEN']
    }
  };

  request(options, function(err, res, body){
    var arr = JSON.parse(body);
    cb(err, arr);
  });
}

function downloadImageByURL(url, filePath) {
  var finalFilePath = "./avatars/" + filePath
  request.get(url).pipe(fs.createWriteStream(finalFilePath));
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  result.forEach(function (object) {
    var url = object['avatar_url'];
    var filePath = object['login'];
    downloadImageByURL(url, filePath);
  })
});

// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")

// request.get('http://google.com/img.png').pipe(request.put('http://mysite.com/img.png'))
