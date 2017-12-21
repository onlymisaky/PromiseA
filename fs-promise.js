const fs = require('fs');

const fsPromise = (...args) => {
    return new Promise((resolve, reject) => {
        fs.readFile.call(null, ...args, (err, data) => {
            return err ? reject(err) : resolve(data);
        });
    });
}

module.exports = fsPromise;
