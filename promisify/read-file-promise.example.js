const readFilePromise = require('./read-file-promise');

const _ = __dirname;


//#region Promise.prototype.then

let text = '';

readFilePromise(_ + '/README.md', 'utf-8')
    .then(data => {
        text += data;
        return readFilePromise(__filename);
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

//#endregion


//#region Promise.all

let pathList = [_ + '/README.md', __filename];

let texts = [];

let ps = pathList.map(path => readFilePromise(path, 'utf-8'));

ps.forEach((p, index) => {

    p.then(data => {
        texts.push(data);
    });

});

Promise.all(ps)
    .then(data => {
        console.log('read complete!');
        console.log('--------------------');
        console.log(texts.join(''));
    })
    .catch(err => {
        console.log('read error!');
        console.log('--------------------');
        console.log(err);
        console.log('--------------------');
        console.log(texts.join(''));
    });

//#endregion


