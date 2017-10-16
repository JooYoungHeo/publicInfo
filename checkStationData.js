let path = require('path');
let {Station} = require(path.join(process.cwd(), 'models'));

let line = process.argv[2];

findStation(line).then(result => {
  result.forEach(item => {
    console.log(JSON.stringify(item));
  });
}).catch(err => {
  console.error(err);
});

function findStation(line) {
  return new Promise((resolve, reject) => {
    Station.find({line: line},{stationName: 1}).exec((err, item) => {
      err? reject(err): resolve(item);
    });
  });
}
