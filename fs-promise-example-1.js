const fsPromise = require('./fs-promise');

const _ = __dirname;

let text = '';

fsPromise(_ + '/README.md', 'utf-8')
    .then(data => {
        text += data;
        return fsPromise(__filename);
    })
    .then(data => {
        text += data;
        console.log('read complete!');
        console.log('--------------------');
        console.log(text);
    })
    .catch(err => {
        console.log('read error!');
        console.log('--------------------');
        console.log(err);
        console.log('--------------------');
        console.log(text);
    });
