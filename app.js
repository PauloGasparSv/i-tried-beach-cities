'use strict';
const http = require('./http');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const wikiBeaches = 'https://en.wikipedia.org/wiki/List_of_beaches';
const wikiAirports = 'https://pt.wikipedia.org/wiki/Lista_de_aeroportos_por_pa%C3%ADs';

function checkCache() {
    if (!fs.existsSync('./.cache')) {
        fs.mkdirSync('./.cache');
    }
}

function getCached(file) {
    if (!fs.existsSync(`./.cache/${file}`)) {
        return null;
    }
    return fs.readFileSync(file);
}

function cache(file, content) {
    return fs.writeFileSync(`./.cache/${file}`, content);
}

(
async function main() {
    try {
        checkCache();
        console.log('Loading beaches page');
        let beachPage = getCached('beachPage');
        if (!beachPage) {
            beachPage = await http.get(wikiBeaches);
            beachPage = beachPage.body;
            cache('beachPage', beachPage);
        }
        console.log('Loading airports page');
        let airportPages = getCached('airportPages');
        if (!airportPages) {
            airportPages = await http.get(wikiAirports);
            airportPages = airportPages.body;
            cache('airportPages', airportPages);
        }
        console.log('Traversing through beaches');
        let { document } = (new JSDOM(beachPage)).window;
        console.log(document.querySelector('#firstHeading').textContent);
    } catch(e) {
        return;
    }
}
)();