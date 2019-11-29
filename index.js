const urlRegex = require("url-regex");
const fetch = require("node-fetch");
const express = require('express')
const app = express()
const port = process.env.PORT || 3210;
const fs = require('fs')
const util = require('util');


app.get('/https://vm.tiktok.com/:id', (req, res) => {
  // STAT: count the number of uses
  const counter = __dirname+'/counter.txt'
  fs.readFile(counter, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = parseInt(data);
    result++
    result = result.toString()

    fs.writeFile(counter, result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });

  let url = 'https://vm.tiktok.com/' + req.params.id;
  if (url <= 2) {
    console.log('Missing or Invalid URL');
    res.json({
      'found': 'no',
      'reason': 'Missing or Invalid URL'
    })
  }else{
  if (url.endsWith('/')) url = url.substring(0, url.length - 1);

  const urlParts = url.split("/");
  let id = urlParts[urlParts.length - 1];

  if(id.includes("?")) id = id.split("?")[0];

  var outputFolder = './';

  if (process.argv.length >= 4) outputFolder = process.argv[3];

  if (!outputFolder.endsWith('/')) outputFolder += '/';

  fetch(url)
    .then(res => {
      return res.text();
    })
    .then(body => {
      const urls = body.match(urlRegex());
      const mediaUrl = urls.find(url => url.includes("muscdn.com") && url.includes("https://v"));
      console.log(`Found Media URL: ${mediaUrl}`);
      res.json({
        'found': 'yes',
        'url': mediaUrl
      })
    });
  }
})
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});


