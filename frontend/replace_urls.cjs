const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function findAndReplace(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findAndReplace(filePath);
        } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
            let content = fs.readFileSync(filePath, 'utf-8');
            let updated = false;

            // Replace single quotes: 'http://localhost:3000
            if (content.includes("'http://localhost:3000")) {
                content = content.replace(/'http:\/\/localhost:3000/g, "(import.meta.env.VITE_API_URL || 'http://localhost:3000') + '");
                updated = true;
            }

            // Replace double quotes: "http://localhost:3000
            if (content.includes("\"http://localhost:3000")) {
                content = content.replace(/"http:\/\/localhost:3000/g, "(import.meta.env.VITE_API_URL || 'http://localhost:3000') + \"");
                updated = true;
            }

            // Replace backticks: `http://localhost:3000
            if (content.includes("\`http://localhost:3000")) {
                content = content.replace(/`http:\/\/localhost:3000/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}");
                updated = true;
            }

            if (updated) {
                fs.writeFileSync(filePath, content, 'utf-8');
                console.log(`Updated ${filePath}`);
            }
        }
    }
}

findAndReplace(srcDir);
console.log('Finished updating URLs');
