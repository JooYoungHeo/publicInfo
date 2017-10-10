let fs = require('fs');
let path = require('path');
let request = require('request');
let config = require('./config');
let xml2js = require('xml2js').parseString;
let {Station} = require(path.join(process.cwd(), 'models'));

let publicKey = config.public.key;

findStation().then(result => {
  result.forEach(item => {
    
  });
});

function findStation() {
  return new Promise((resolve, reject) => {
    Station.find({
      line: 'SES08호선'
    }).exec((err, item) => {
      if(err) reject(err);
      else resolve(item);
    });
  });
}
