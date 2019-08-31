'use strict';
const http = require('./http');
const path = require('path');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const wikiBeaches = 'https://en.wikipedia.org/wiki/List_of_beaches';
const wikiAirports = 'https://pt.wikipedia.org/wiki/Lista_de_aeroportos_por_pa%C3%ADs';

function checkCache() {
    if (process.env.NO_CACHE === '1') {
        const files = fs.readdirSync('.cache');
        for (let f of files ) {
            fs.unlinkSync(path.join('.cache', f));
        }
        fs.rmdirSync('.cache');
    }
    if (!fs.existsSync('.cache')) {
        fs.mkdirSync('.cache');
    }
}

function getCached(file) {
    if (!fs.existsSync(path.join('.cache',file))) {
        return null;
    }
    return fs.readFileSync(path.join('.cache',file));
}

function cache(file, content) {
    return fs.writeFileSync(path.join('.cache',file), content);
}

(
async function main() {
    try {
        checkCache();
        const startTime = new Date().getTime();
        console.log('>>>> Started Loading Beaches Page');
        let beachPage = getCached('beachPage');
        if (!beachPage) {
            beachPage = await http.get(wikiBeaches);
            beachPage = beachPage.body;
            cache('beachPage', beachPage);
        }
        console.log('>>>> Finished Loading Beaches Page');
        console.log('>>>> Started Loading Airports Page');
        let airportPages = getCached('airportPages');
        if (!airportPages) {
            airportPages = await http.get(wikiAirports);
            airportPages = airportPages.body;
            cache('airportPages', airportPages);
        }
        console.log('>>>> Finished Loading Airports Page');
        let { document } = (new JSDOM(beachPage)).window;
        console.log(document.querySelector('#firstHeading').textContent);
        const endTime = new Date().getTime();

        console.log(`Whole process took ${(endTime - startTime)/1000} seconds.`)
    } catch(e) {
        console.log(e);
        return;
    }
}
)();