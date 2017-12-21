const fsPromise = require('./fs-promise');

const _ = __dirname;

let paths = [_ + '/README.md', __filename];

let texts = [];

let ps = paths.map(path => { return fsPromise(path, 'utf-8'); });

ps.forEach((p, index) => {

    p.then(data => {
        texts.push(data);
    });
    
})

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
