'use strict';
const browser  = require('./browser');
const cache = require('./cache');
const wikiBeaches = 'https://en.wikipedia.org/wiki/List_of_beaches';
const wikiAirports = 'https://pt.wikipedia.org/wiki/Lista_de_aeroportos_por_pa%C3%ADs';
const startTime = new Date().getTime();

(
    async function main() {
        cache.check();

        await loadBeaches();

        time();
        // Promise.all([
        //     loadBeaches(),
        //     loadAirports()
        // ])
        // .then(values => {
        //     if(!values || values.length !== 2) {
        //         throw new Error('How in the world could this happen.')
        //     }
        //     console.log(values[0]);
        // })
        // .catch(error => {
        //     console.log(error);
        // });
    }
)();

function time() {
    const endTime = new Date().getTime();
    console.log(`Whole process took ${(endTime - startTime)/1000} seconds.`)
}

function loadBeaches() {
    return new Promise(async (resolve, reject) => {
        const data = {};
        const page = await browser.loadPage(wikiBeaches);
        const document = browser.getDocument(page);

        const titles = document.querySelectorAll('#bodyContent h2');
        console.log(`>>>> Started Looping through all the ${titles.length} titles on page.`);
        titles.forEach((el, index) => {
            if (el.querySelector('#See_also') || el.querySelector('#References') || !el.querySelector('a')) {
                return;
            }
            const title = el.querySelector('a').innerHTML.toUpperCase();
            data[title] = [];
            const ulLists = [];
            let next = el.nextElementSibling;
            let foundAnotherTitle = false;
            let recursion = null;
            while(!foundAnotherTitle && !recursion) {
                const tag = next.tagName.toUpperCase();
                if(next.hasAttribute('role') && next.getAttribute('role') === 'note') {
                    recursion = wikiBeaches.split('/wiki')[0] + next.querySelector('a').getAttribute('href');
                    console.log(recursion);
                    foundAnotherTitle = true;
                }
                if(tag === 'UL') {
                    const ul = next.querySelector('ul') || next;
                    ulLists.push(ul);
                } else if (next.classList.contains('div-col')) {
                    const ul = next.querySelector('ul') || next;
                    ulLists.push(ul);
                } else if(tag === 'H2') {
                    foundAnotherTitle = true;
                }
                next = next.nextElementSibling;
            }

            ulLists.forEach(ul => {
                ul.querySelectorAll('li').forEach(li => {
                    if (li.querySelector('img')) {
                        return;
                    }
                    const link = li.querySelector('a');
                    data[title].push(link ? link.innerHTML.toUpperCase() : li.innerHTML.toUpperCase());
                });
            });
        });
        console.log('>>>> Finished Looping through all titles on page.');
        resolve(data);
    });
}
