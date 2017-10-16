let fs = require('fs');
let path = require('path');
let request = require('request');
let async = require('async');
let config = require('./config');
let xml2js = require('xml2js').parseString;
let {StationTimeInfo} = require(path.join(process.cwd(), 'models'));

let publicKey = config.public.key;
let url = 'http://openapi.tago.go.kr/openapi/service/SubwayInfoService/getSubwaySttnAcctoSchdulList';

let line = process.argv[2];
let upDownCodeList = ['D', 'U'];
let dailyCodeList = ['01', '02', '03'];
let stationId = process.argv[3];
let stationName = process.argv[4];

for (let i in dailyCodeList) {

  let dailyCode = dailyCodeList[i];

  for (let j in upDownCodeList) {

    let upDownCode = upDownCodeList[j];

    requestScheduleUrl(stationId, stationName, dailyCode, upDownCode);
  }
}

function requestScheduleUrl(stationId, stationName, dailyCode, upDownCode) {
  let requestCount = 0;
  let pageNo = 1;
  let flag = true;
  let timeList = [];

  async.whilst(function() {
    return flag;
  }, function(callback) {
    let requestUrl = `${url}?ServiceKey=${publicKey}&subwayStationId=${stationId}&dailyTypeCode=${dailyCode}&upDownTypeCode=${upDownCode}&pageNo=${pageNo}`;

    requestPublicInfo(requestUrl)
    .then(result => convertXmlToJs(result))
    .then(result => {
      requestCount++;

      let items = result.response.body[0].items[0].item;

      if (items === undefined) {
        flag = false;
      } else {
        for (let i = 0 ; i < items.length ; i++) {
          timeList.push({
            depTime: items[i].depTime[0],
            endStationName: items[i].endSubwayStationNm[0]
          });
        }
        pageNo++;
      }
      callback();
    }).catch(err => {
      flag = false;
      callback();
    });
  }, function(err) {
    if (err) console.error(err);
    createDoc(stationName, stationId, timeList, dailyCode, upDownCode, requestCount);
  });
}

function requestPublicInfo(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      err? reject(err): resolve(body);
    });
  });
}

function convertXmlToJs(body) {
  return new Promise((resolve, reject) => {
    xml2js(body, (err, result) => {
      err? reject(err): resolve(result);
    });
  });
}

function createDoc(stationName, stationId, timeTable, dailyType, upDownType, requestCount) {
  let item = new StationTimeInfo();

  item.line = line;
  item.stationName = stationName;
  item.stationId = stationId;
  item.timeTable = timeTable;
  item.dailyType = dailyType;
  item.upDownType = upDownType;
  item.abbreviation = '';
  item.type = 'Subway';

  item.save(err => {
    if (err) console.error(err);
    else {
      console.log(`url request count: ${requestCount}`);
      console.log(`${stationName} - (${dailyType}, ${upDownType}) create done`);
    }
  });
}
