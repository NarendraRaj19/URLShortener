require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser')
var dns = require('dns');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

let responseObject = {};

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {

  //Regex to handle scenarios where https in present in the url as DNS lookup can't handle it
  const REPLACE_REGEX = /^https?:\/\//i;

  const url = req.body.url;

  //remove https part if present from the url
  const finalUrl = url.replace(REPLACE_REGEX, '');

  console.log("Final URl", finalUrl);

  var w3 = dns.lookup(finalUrl, function (err, addresses, family) {
    
    if(err){
      console.log("Invalid URL !!");
      //responseObject["error"] = 'invalid url';
      res.json({"error":"invalid url"});
    } else {
      console.log("valid URL !!");
      //responseObject["original_url"] = url;
      res.json({"original_url":url});
    }
    console.log(addresses);
    console.log(family);

    //res.send("empty");
  });
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
