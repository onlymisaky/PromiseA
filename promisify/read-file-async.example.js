let readFileAsync = require('./read-file-async');

//#region 读取一个文件

readFileAsync.readFileAsync('./README.md', 'utf-8')
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.log(err);
    });

//#endregion


//#region 依次读取多个文件

let files = [
    './ajax-promise.js',
    ['./README.md', 'utf-8']
];

readFileAsync.readFilesAsync(files)
    .then(data => {
        console.log(data.join(''));
    })
    .catch(err => {
        console.log(err);
    });

//#endregion
