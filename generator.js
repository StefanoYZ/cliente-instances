// generator.js
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

// 1. registrar parciales
const partialsDir = path.join(__dirname, "templates/partials");
fs.readdirSync(partialsDir).forEach((file) => {
  const name = path.basename(file, ".hbs");
  const content = fs.readFileSync(path.join(partialsDir, file), "utf8");
  Handlebars.registerPartial(name, content);
});

// 2. leer layout y página
const layout = fs.readFileSync(
  path.join(__dirname, "templates/layouts/main.hbs"),
  "utf8"
);
const pageTpl = fs.readFileSync(
  path.join(__dirname, "templates/pages/index.hbs"),
  "utf8"
);

// 3. datos (home.json)
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/home.json"), "utf8")
);

// 4. compilar página y meter en layout
const pageHtml = Handlebars.compile(pageTpl)(data);
const finalHtml = Handlebars.compile(layout)({
  ...data,
  body: pageHtml
});

// 5. escribir en dist/index.html
const distDir = path.join(__dirname, "dist");
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);
fs.writeFileSync(path.join(distDir, "index.html"), finalHtml);

console.log("Página generada en dist/index.html");

// --- Copiar assets a dist/assets ---
const srcAssets = path.join(__dirname, "templates/assets");
const dstAssets = path.join(distDir, "assets");

// Crea dist/assets y copia si existen assets
if (fs.existsSync(srcAssets)) {
  // Node 16+ tiene fs.cpSync con { recursive: true }
  fs.mkdirSync(dstAssets, { recursive: true });
  fs.cpSync(srcAssets, dstAssets, { recursive: true });
  console.log("Assets copiados a dist/assets");
} else {
  console.warn("No se encontró templates/assets; omitiendo copia de assets.");
}
