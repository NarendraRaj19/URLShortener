# URL Shortener Microservice

I created this app as a requirement for my freeCodeCamp APIs and Microservices Certification, using Node.js and Express. Instructions for building your project can be found at https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice. The above front end API test also uses Bootstrap, jQuery, and highlight.js. The API fulfills the following user story:

## Requirements
To get a short URL for a given valid URL. On following the short url by appending as part of the /api/shorturl URL it should redirect to the original page of the given URL. 

### Example usage:  
[base url]/api/shorturl  
### Example output:  
{"original_url":"https://www.google.com","short_url":1}
baseurl/api/shorturl/1 ==> Redirect to Google.com
