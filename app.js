'use strict';
const http = require('./http');
const { JSDOM } = require('jsdom');
const wikiBeaches = 'https://en.wikipedia.org/wiki/List_of_beaches';
const wikiAirports = 'https://pt.wikipedia.org/wiki/Lista_de_aeroportos_por_pa%C3%ADs';
const cache = require('./cache');
(
async function main() {
    cache.check();
    const startTime = new Date().getTime();

    Promise.all([
        loadBeaches(),
        loadAirports()
    ])
    .then(values => {
        const endTime = new Date().getTime();
        console.log(`Whole process took ${(endTime - startTime)/1000} seconds.`)
    })
    .catch(error => {
        console.log(error);
    });
}
)();

function loadBeaches() {
    return new Promise(async (resolve, reject) => {
        console.log('>>>> Started Loading Beaches Page');
        let beachPage = cache.load('beachPage');
        if (!beachPage) {
            beachPage = await http.get(wikiBeaches);
            beachPage = beachPage.body;
            cache.save('beachPage', beachPage);
        }
        console.log('>>>> Finished Loading Beaches Page');
        let { document } = (new JSDOM(beachPage)).window;
        console.log(document.querySelector('#firstHeading').textContent);
    });
}
function loadAirports() {
    return new Promise(async (resolve, reject) => {
        console.log('>>>> Started Loading Airports Page');
        let airportPages = cache.load('airportPages');
        if (!airportPages) {
            airportPages = await http.get(wikiAirports);
            airportPages = airportPages.body;
            cache.save('airportPages', airportPages);
        }
        console.log('>>>> Finished Loading Airports Page');
    });
}