const readFilePromise = require('./read-file-promise');

const readFileAsync = async (...args) => {
    try {
        return await readFilePromise(...args);
    } catch (error) {
        throw (new Error(error));
    }
}


// 此处对参数的处理写法不是很合理
const readFilesAsync = async (args) => {
    try {

        let data = [];

        for (let params of args) {

            if (Array.isArray(params)) {
                data.push(await readFilePromise(...params));
            }

            else {
                data.push(await readFilePromise(params));
            }

        }

        return data;

    } catch (error) {
        throw (new Error(error));
    }
}


module.exports = {
    readFileAsync,
    readFilesAsync
}


