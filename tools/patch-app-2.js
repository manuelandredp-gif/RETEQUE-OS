// Ajuste: las fotos dinámicas usan background-image para que el navegador no pida "{{ p.img }}" antes de enlazar los datos.
// Uso: tools\node.cmd tools\patch-app-2.js
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'app', 'index.html');
let s = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const log = [];
let failed = false;

function rep(find, replace, expect) {
  const parts = s.split(find);
  const n = parts.length - 1;
  if (n === 0 || (expect !== null && n !== expect)) {
    log.push('FAIL (' + n + (expect === null ? '' : ' != ' + expect) + '): ' + find.slice(0, 90));
    failed = true;
    return;
  }
  s = parts.join(replace);
  log.push('ok x' + n + ': ' + find.slice(0, 70));
}

rep('img.rq-photo{width:100%;height:100%;object-fit:cover;display:block;background:#FFF3DF}',
    'img.rq-photo{width:100%;height:100%;object-fit:cover;display:block;background:#FFF3DF}\ndiv.rq-photo{width:100%;height:100%;background-size:cover;background-position:center;background-repeat:no-repeat;background-color:#FFF3DF}', 1);
rep('<img class="rq-photo" src="{{ p.img }}" alt="{{ p.name }}">',
    '<div class="rq-photo" role="img" aria-label="{{ p.name }}" style="background-image:url({{ p.img }})"></div>', 4);
rep('<img class="rq-photo" src="{{ it.img }}" alt="">',
    '<div class="rq-photo" role="img" aria-label="{{ it.name }}" style="background-image:url({{ it.img }})"></div>', 1);
rep('<img class="rq-photo" src="{{ dImg }}" alt="{{ dName }}">',
    '<div class="rq-photo" role="img" aria-label="{{ dName }}" style="background-image:url({{ dImg }})"></div>', 1);

fs.writeFileSync(file, s);
console.log(log.join('\n'));
if (failed) { console.log('\nHUBO FALLOS'); process.exit(1); }
console.log('\nOK app-2');
