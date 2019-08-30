'use strict';
const request = require('request');
module.exports = {
    get: (url, params) => {
        return new Promise((resolve, reject) => {
            request(url, function (error, response, body) {
                if (error || !body || response.statusCode !== 200) {
                    console.log('Could not load ' + url);
                    return reject({
                        success: false,
                        error,
                        response
                    });
                }
                resolve({
                    success: true,
                    body
                });
            });
        });
    }
}