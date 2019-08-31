const path = require('path');
const fs = require('fs');
module.exports = {
    check: () => {
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
    },
    load: (file) => {
        if (!fs.existsSync(path.join('.cache',file))) {
            return null;
        }
        return fs.readFileSync(path.join('.cache',file));
    },
    save: (file, content) =>
        fs.writeFileSync(path.join('.cache',file), content)
};