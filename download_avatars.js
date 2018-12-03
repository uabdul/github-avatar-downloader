var request = require('request');
var token = require('./secrets.js')

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

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  result.forEach(function (object) {
    console.log(object['avatar_url']);
  })
});

