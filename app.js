'use strict';
const browser  = require('./browser');
const cache = require('./cache');
const wikiAirports = 'https://en.wikipedia.org/wiki/List_of_airports';
const startTime = new Date().getTime();

(
    async function main() {
        try {
            // Checks if the .cache folder exists and wether or not to delete it.
            cache.check();
            // Getting every airport page on wikipedia.
            let airports = await loadAirports();

            // Since this will take forever, i'll do the process with only one airport.
            airports = [ airports[0] ];

            for(let airport of airports) {
                await search(airport);
            }

            // Registering how long the code took to run.
            const endTime = new Date().getTime();
            console.log(`Whole process took ${(endTime - startTime)/1000} seconds.`);
        } catch(e) {
            console.error(e);
            console.error('Could not finish crawling.');
        }
    }
)();

// Retrieves the list of airports of the world
function loadAirports() {
    return new Promise(async (resolve, reject) => {
        try {
            // Downloading the airport list indexing page from wikipedia
            const page = await browser.loadPage(wikiAirports);
            const document = browser.getDocument(page);
            // Getting the link to the first page of airports.
            let link = document
                .querySelector('.mw-selflink.selflink')
                .nextElementSibling
                .nextElementSibling;
            // Preparing an array to store the page for each list.
            const links = [];
            while (link) {
                links.push(wikiAirports.split('/wiki')[0] + link.getAttribute('href'));
                link = link.nextElementSibling;
            }
            // Preparing an array to store each individual airport wiki page link
            const airports = [];
            for (let link of links) {
                const pg = await browser.loadPage(link);
                const doc = browser.getDocument(pg);
                for (let tr of doc.querySelectorAll('table tr')) {
                    const airport = tr.querySelector('td:nth-child(3) a');
                    if(!airport) {
                        continue;
                    }
                    const href = airport.getAttribute('href');
                    if(!href || !href.includes('wiki')) {
                        continue;
                    }
                    airports.push(wikiAirports.split('/wiki')[0] + airport.getAttribute('href'));
                }
            }
            // Returning all the links
            resolve(airports);
        } catch(e) {
            reject(e);
        }
    });
}

async function search(airport) {
    try {
        // Downloading the airport list indexing page from wikipedia
        const page = await browser.loadPage(airport);
        const document = browser.getDocument(page);

        let location = null;
        document.querySelectorAll('.infobox th').forEach(th => {
            if(location) {
                return;
            }
            const html = th.innerHTML.toUpperCase();
            if(html.includes('LOCATION') || html.includes('COORDINATES')) {
                location = th.nextElementSibling.textContent;
            }
        });
        console.log('My location: ' + location);
    } catch(e) {
        console.log(e);
    }
}