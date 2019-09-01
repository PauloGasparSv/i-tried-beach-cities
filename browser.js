'use strict';
const http = require('./http');
const cache = require('./cache');
const { JSDOM } = require('jsdom');

module.exports = {
    loadPage(url) {
        return new Promise(async (resolve, reject) => {
            console.log('>>>> Started Loading ' + url);
            const splits = url.split('/')
            let page = cache.load(splits[splits.length - 1]);
            if (!page) {
                page = await http.get(url);
                page = page.body;
                cache.save(splits[splits.length - 1], page);
            }
            console.log('>>>> Finished Loading ' + url);
            resolve(page);
        });
    },
    getDocument(page) {
        let { document } = (new JSDOM(page)).window;
        return document;
    }
};