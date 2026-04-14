const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('frontend/src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

let changedFiles = 0;
files.forEach(file => {
    const original = fs.readFileSync(file, 'utf8');
    const modified = original.replace(/\s?font-(inter|poppins|headline|roboto|k2d)\b/g, '');
    if (original !== modified) {
        fs.writeFileSync(file, modified, 'utf8');
        changedFiles++;
    }
});
console.log(`Updated ${changedFiles} files with centralized fonts.`);
