// Corrige el único fallo del parche anterior: elimina el bloque de direcciones/etiqueta principal huérfano.
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'app', 'index.html');
let s = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

const re = /      addresses: \[\['Casa','Av\. Bolognesi 845, Tacna'\],\['Trabajo','Calle Zela 320, Tacna'\]\]\.map\(a => \(\{[\s\S]*?dot: st\.addr === a\[0\] \? P\.coral : 'transparent'\n      \}\)\),\n      addrTags: \['Casa','Trabajo','Otro'\]\.map\(t =>\n        this\.chip\(t, st\.addrTag === t, \(\) => this\.setState\(\{addrTag: t\}\)\)\),\n      toggleMain: \(\) => this\.setState\(s => \(\{mainAddr: !s\.mainAddr\}\)\),\n      mainTrack: st\.mainAddr \? P\.coral : '#DCD2C1',\n      mainJustify: st\.mainAddr \? 'flex-end' : 'flex-start',\n/;
const m = s.match(re) || [];
console.log('matches:', m.length);
if (m.length !== 1) { console.log('FAIL'); process.exit(1); }
s = s.replace(re, '');
fs.writeFileSync(file, s);
console.log('OK fix');
