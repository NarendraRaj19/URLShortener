require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
//To Parse Request JSON
var bodyParser = require('body-parser')
//To Perform a lookup to validate a given URL
var dns = require('dns');
//To Generate Short URL 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

const baseUrl = "http://localhost:3000/api/shorturl";

const collectionOfURLs = new Set();
const urlMappings = new Map();
const urlMappings2 = new Map();

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const url = req.body.url;

  if(!url.includes('https://')){
      console.log("Doesn't include Https Part")
      res.json({"error":"invalid url"});
  } else {

      //Regex to handle scenarios where https in present in the url as DNS lookup can't handle it
      const REPLACE_REGEX = /^https?:\/\//i;
      //remove https part if present from the url as dns cant handle https part while lookup
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

          if(collectionOfURLs.has(url)){
            var mappedShortURLValue = urlMappings.get(url);
            res.json({"original_url":url,"short_url":mappedShortURLValue});
          } else {
            var shortURL = Math.random().toString(32).substring(2, 5);
            console.log("Generated Short URL: ", shortURL)
            //console.log("Generated Total Short URL: ", baseUrl +'/'+ shortURL)
            collectionOfURLs.add(url);
            urlMappings.set(url, shortURL);
            urlMappings2.set(shortURL, url);
            res.json({"original_url":url,"short_url":shortURL});
          }
          
        }
  });
  }
});

app.get("/api/shorturl/:shortURL", function(req,res){
    var shortURL = req.params.shortURL;
    //Retrieve Original from Map using ShortURL value passed
    var originalVal = urlMappings2.get(shortURL);
    if(originalVal){
      res.redirect(originalVal);
    } else  {
      console.log("Entered Wrong Short URL")
      res.json({"error":"Wrong format"});
    }
    
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
