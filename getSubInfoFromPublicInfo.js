let fs = require('fs');
let path = require('path');

let resourceFile = fs.readFileSync(path.join(process.cwd(), '../resource.json'));
let publicKey = JSON.parse(resourceFile).public.key;
