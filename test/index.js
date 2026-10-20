// Punto de entrada de Karma: carga todos los archivos *.spec.js de esta carpeta
const contexto = require.context("./", true, /\.spec\.js$/);
contexto.keys().forEach(contexto);
