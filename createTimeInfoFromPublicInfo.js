let fs = require('fs');
let path = require('path');
let request = require('request');
let async = require('async');
let config = require('./config');
let xml2js = require('xml2js').parseString;
let {Station} = require(path.join(process.cwd(), 'models'));

let publicKey = config.public.key;
let url = 'http://openapi.tago.go.kr/openapi/service/SubwayInfoService/getSubwaySttnAcctoSchdulList';
let line = 'SES08호선';
let upDownCodeList = ['D', 'U'];
let dailyCodeList = ['01', '02', '03'];

requestScheduleUrl('SES2814', '01', 'D');

// findStation(line).then(result => {
//   result.forEach(item => {
//     let stationId = item._id;
//     for (let i in dailyCodeList) {
//       let dailyCode = dailyCodeList[i];
//       for (let j in upDownCodeList) {
//         let upDownCode = upDownCodeList[j];
//
//         requestScheduleUrl(stationId, dailyCode, upDownCode);
//       }
//     }
//   });
// });

function findStation(line) {
  return new Promise((resolve, reject) => {
    Station.find({
      line: line
    }).exec((err, item) => {
      if(err) reject(err);
      else resolve(item);
    });
  });
}

function requestScheduleUrl(stationId, dailyCode, upDownCode) {
  let pageNo = 1;
  let flag = true;

  async.whilst(function() {
    return flag;
  }, function(callback) {
    let requestUrl = `${url}?ServiceKey=${publicKey}&subwayStationId=${stationId}&dailyTypeCode=${dailyCode}&upDownTypeCode=${upDownCode}&pageNo=${pageNo}`;

    request(requestUrl, (err, res, body) => {
      if (err) {;
        flag = false;
        callback();
        return;
      }

      xml2js(body, (err, result) => {
        let items = result.response.body[0].items[0].item;
        if (items === undefined) {
          flag = false;
          callback();
          return;
        }

        for (let i = 0 ; i < items.length ; i++) {
          console.log(`${stationId} - ${dailyCode} - ${upDownCode} - ${items[i].arrTime}`);
        }

        pageNo++;
        callback();
      });
    });
  }, function(err) {
    console.log('done');
  });
}
