let path = require('path');
let {Station, StationTimeInfo} = require(path.join(process.cwd(), 'models'));

findStation().then(result => {
  result.forEach(item => {
    console.log(JSON.stringify(item));
  });
}).catch(err => {
  console.error(err);
});

function findStation() {
  return new Promise((resolve, reject) => {
    Station.find({},{stationName: 1}).exec((err, item) => {
      err? reject(err): resolve(item);
    });
  });
}
