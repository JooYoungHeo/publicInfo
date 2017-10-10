let fs = require('fs');
let path = require('path');
let request = require('request');
let config = require('./config');
let xml2js = require('xml2js').parseString;
let {Station} = require(path.join(process.cwd(), 'models'));

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
      let items = result.response.body[0].items[0].item;
      for (let i in items) {
        createDoc('', items[i].subwayStationId[0], items[i].subwayStationName[0]);
      }
    });
  });
}

function createDoc(line, stationId, stationName) {
  let item = new Station();

  item._id = stationId;
  item.line = line;
  item.stationName = stationName;
  item.type = 'subway';

  item.save(err => {
    if (err) console.error(err);
    else console.log(`${stationId} - ${stationName} create done`);
  });
}
