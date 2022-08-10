require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config({ path: "./config.env" });
//To Parse Request JSON
var bodyParser = require('body-parser')
//To Perform a lookup to validate a given URL
var dns = require('dns');
var urlparser = require('url');

var mongo = require('mongodb');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;
//Database Connection
let uri = 'mongodb+srv://narenrj:AtlasPassword@freecodecamp-backendapi.kuafusj.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("State of Mongoose: ",mongoose.connection.readyState);

let Url = mongoose.model('Url', {
  original: { type: String },
  shortURL: { type: String }
})

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.post('/api/shorturl', async function(req, res) {
  let originalUrl = req.body.url;

  const parsedUL = dns.lookup(urlparser.parse(originalUrl).hostname, function(err, address){
    if(!address){
      res.json({"error":"Wrong format"});
    } else {
      Url.findOne({original : originalUrl}, (err, docs) => {
        if(!docs){
            let generateShortUrl = Math.random().toString(32).substring(2, 5);
            const url = new Url({ original: originalUrl, shortURL:generateShortUrl })
            url.save((err,data) => {
              res.json({
                original_url: data.original,
                short_url: data.shortURL
              })
            })
        } else {
          res.json({
            original_url: docs.original,
            short_url: docs.shortURL
          })
        }
      });

      
    }
  });
})

app.get('/api/shorturl/:input', function(req, res) {
  let inputUrl = req.params.input;
  //console.log("Provide Short URL: ", inputUrl);
  Url.findOne({shortURL : inputUrl}, (err, docs) => {
    if(!docs){
      res.json({"error":"Wrong format"});
    } else {
      res.redirect(docs.original)
    }
  })
  
})



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
