'use strict';
const browser  = require('./browser');
const cache = require('./cache');
const wikiAirports = 'https://en.wikipedia.org/wiki/List_of_airports';
const startTime = new Date().getTime();

// Main function.
// Anonymous because I wanted to use await.
(
    async function main() {
        try {
            // Checks if the .cache folder exists and wether or not to delete it.
            cache.check();
            await loadAirports();
            time();
        } catch(e) {
            console.log('Error, finish.');
        }
    }
)();

// Registers how much time this script took to run.
function time() {
    const endTime = new Date().getTime();
    console.log(`Whole process took ${(endTime - startTime)/1000} seconds.`)
}

// Retrieves the list of airports of the world
function loadAirports() {
    return new Promise(async (resolve, reject) => {
        browser.loadPage(wikiAirports)
        .then(page => {
            const document = browser.getDocument(page);
            let link = document
                .querySelector('.mw-selflink.selflink')
                .nextElementSibling
                .nextElementSibling;
            const links = [];
            while (link) {
                links.push(link.getAttribute('href'));
                link = link.nextElementSibling;
            }
            const airports = [];

            link = links.splice(1);

            links.forEach(async link => {
                try {
                    const pg = await browser.loadPage(link);
                    const doc = browser.getDocument(pg);
                    doc.querySelectorAll('table tr').forEach(tr => {
                        if (!tr.querySelector('td')) {
                            return;
                        }
                        const ICAO = tr.querySelector('td:nth-child(2)');
                        const airport = tr.querySelector('td:nth-child(3)');
                        airports.push({
                            ICAO,
                            airport
                        })
                    });
                } catch(e) {
                    console.error('Error during ' + link);
                }
            });
            resolve(airports);
        })
        .catch(error => reject(error));
    });
}
