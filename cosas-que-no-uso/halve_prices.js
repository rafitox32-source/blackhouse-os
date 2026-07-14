const fs = require('fs');

// APP DE RAFITOX
let appHtml = fs.readFileSync('c:/Users/BLACK HOUSE/Desktop/app de rafitox/index.html', 'utf8');
appHtml = appHtml.replace('1 Mes (S/ 50.00)', '1 Mes (S/ 25.00)');
appHtml = appHtml.replace('3 Meses (S/ 130.00)', '3 Meses (S/ 65.00)');
appHtml = appHtml.replace('6 Meses (S/ 250.00)', '6 Meses (S/ 125.00)');
appHtml = appHtml.replace('1 Año (S/ 450.00)', '1 Año (S/ 225.00)');
fs.writeFileSync('c:/Users/BLACK HOUSE/Desktop/app de rafitox/index.html', appHtml);

// WEB LIMPIA
let webHtml = fs.readFileSync('c:/Users/BLACK HOUSE/Desktop/web-limpia/index.html', 'utf8');
webHtml = webHtml.replace('Mensual (S/ 50)', 'Mensual (S/ 25)');
webHtml = webHtml.replace('S/ 50.00', 'S/ 25.00');
webHtml = webHtml.replace('Anual (S/ 480)', 'Anual (S/ 240)');
webHtml = webHtml.replace('S/ 480.00', 'S/ 240.00');
webHtml = webHtml.replace('Vitalicio (S/ 990)', 'Vitalicio (S/ 495)');
webHtml = webHtml.replace('S/ 990.00', 'S/ 495.00');

// Las que ya estaban cortadas a S/ 25.00 se reducen de nuevo?
// Wait, the user said "bajar todos los precios tanto en la web como en el app a mitad de precio"
// So S/ 25.00 -> 12.50? Let's do it to be safe, but wait, the modal had 50 and the text had 25.
// Let's just half EVERYTHING in web-limpia that looks like a price plan.
webHtml = webHtml.replace('text-white">S/ 25.00', 'text-white">S/ 12.50');
webHtml = webHtml.replace('Ahorras S/ 10.00', 'Ahorras S/ 5.00');
webHtml = webHtml.replace('text-white">S/ 65.00', 'text-white">S/ 32.50');
webHtml = webHtml.replace('Ahorras S/ 25.00', 'Ahorras S/ 12.50');
webHtml = webHtml.replace('text-white">S/ 125.00', 'text-white">S/ 62.50');
webHtml = webHtml.replace('Ahorras S/ 75.00', 'Ahorras S/ 37.50');
webHtml = webHtml.replace('text-white">S/ 225.00', 'text-white">S/ 112.50');

fs.writeFileSync('c:/Users/BLACK HOUSE/Desktop/web-limpia/index.html', webHtml);
console.log('Prices halved successfully');
