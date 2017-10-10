let fs = require('fs');
let path = require('path');
let request = require('request');
let config = require('./config');
let xml2js = require('xml2js').parseString;

let publicKey = config.public.key;

let lineFile = fs.readFileSync('line.txt', 'utf-8');
let stationList = lineFile.split('\n');

stationList.pop();

for (let i in stationList) {
  let stationName = encodeURIComponent(stationList[i]);
  requestUrl(stationName);
}

function requestUrl(name) {
  let url = `http://openapi.tago.go.kr/openapi/service/SubwayInfoService/getKwrdFndSubwaySttnList?ServiceKey=${publicKey}&subwayStationName=${name}`;
  request(url, (err, res, body) => {
    xml2js(body, (err, result) => {
      console.log(result.response.header);
    });
  });
}
