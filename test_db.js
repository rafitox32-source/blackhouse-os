const fs = require('fs');
const html = fs.readFileSync('c:/Users/BLACK HOUSE/Desktop/web-limpia/index.html', 'utf8');

const lines = html.split('\n');
console.log("Last 50 lines of index.html in web-limpia:");
for (let i = lines.length - 50; i < lines.length; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
}
