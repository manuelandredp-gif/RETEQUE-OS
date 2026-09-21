const fs = require('fs');
const html = fs.readFileSync('app/index.html', 'utf8');
const m = html.match(/<script type="text\/x-dc" data-dc-script[^>]*>([\s\S]*?)<\/script>/);
if (!m) { console.log('NO SCRIPT FOUND'); process.exit(1); }
try {
  new Function(m[1]);
  console.log('JS SYNTAX OK, length', m[1].length);
} catch (e) {
  console.log('SYNTAX ERROR:', e.message);
  process.exit(1);
}
