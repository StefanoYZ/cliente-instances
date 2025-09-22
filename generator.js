// generator.js
const fs = require('fs');
const path = require('path');

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function htmlEscape(s){ return String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

function renderIndex({ cliente, industria, modules }) {
  const list = modules.map(m => `<li>${htmlEscape(m)}</li>`).join('');
  return `<!doctype html>
<html lang="es">
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Instancia de ${htmlEscape(cliente)}</title>
<link rel="stylesheet" href="https://unpkg.com/mvp.css">
<body>
  <header>
    <h1>Instancia de ${htmlEscape(cliente)}</h1>
    <p>Industria: ${htmlEscape(industria)} — Módulos habilitados:</p>
    <ul>${list || '<li>Sin módulos</li>'}</ul>
  </header>
  <main>
    ${modules.includes('pago') ? `<p>→ <a href="./pago.html">Módulo de Pago</a></p>` : ''}
    ${modules.includes('agenda') ? `<p>→ <a href="./agenda.html">Módulo de Agenda</a></p>` : ''}
    ${modules.includes('calendario') ? `<p>→ <a href="./calendario.html">Módulo de Calendario</a></p>` : ''}
    ${modules.includes('visor de archivos') ? `<p>→ <a href="./visor.html">Visor de Archivos</a></p>` : ''}
  </main>
  <footer><small>Simulación de despliegue · GitHub Pages</small></footer>
</body>
</html>`;
}

function renderModulePage(title, contentHtml){
  return `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="https://unpkg.com/mvp.css">
<title>${title}</title><body><main><h1>${title}</h1>${contentHtml}<p><a href="./index.html">Volver</a></p></main></body>`;
}

function run() {
  const cliente = process.env.CLIENTE || 'demo';
  const industria = process.env.INDUSTRIA || 'n/a';
  const modules = (process.env.MODULES || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

  const dest = path.join('dist', cliente);
  ensureDir(dest);

  // index
  fs.writeFileSync(path.join(dest, 'index.html'), renderIndex({ cliente, industria, modules }), 'utf8');

  // páginas de módulos (simples, pero “de calidad”)
  if (modules.includes('pago')) {
    fs.writeFileSync(path.join(dest, 'pago.html'),
      renderModulePage('Módulo de Pago', `<p>Simulación: botón de cobro, estado de pago (mock).</p><pre>{
  "payment_provider": "mock-pay",
  "status": "ready"
}</pre>`), 'utf8');
  }

  if (modules.includes('agenda')) {
    fs.writeFileSync(path.join(dest, 'agenda.html'),
      renderModulePage('Módulo de Agenda', `<p>Simulación: agendar cita (no persiste).</p>
<form onsubmit="event.preventDefault();alert('Cita agendada (simulación)');">
  <label>Fecha <input type="date" required></label>
  <label>Hora <input type="time" required></label>
  <button>Agendar</button>
</form>`), 'utf8');
  }

  if (modules.includes('calendario')) {
    fs.writeFileSync(path.join(dest, 'calendario.html'),
      renderModulePage('Módulo de Calendario', `<p>Eventos (mock):</p><pre>[
  {"title":"Consulta","start":"2025-09-22T09:00"},
  {"title":"Limpieza","start":"2025-09-22T11:00"}
]</pre>`), 'utf8');
  }

  if (modules.includes('visor de archivos')) {
    fs.writeFileSync(path.join(dest, 'visor.html'),
      renderModulePage('Visor de Archivos', `<p>Sube un archivo (no se sube realmente; demo local):</p>
<input type="file" onchange="alert('Archivo detectado (simulación).');" />`), 'utf8');
  }

  // config.json para “outputs”
  fs.writeFileSync(path.join(dest, 'config.json'), JSON.stringify({ cliente, industria, modules }, null, 2), 'utf8');

  console.log(`Generado dist para ${cliente} con módulos: ${modules.join(', ')}`);
}

run();

