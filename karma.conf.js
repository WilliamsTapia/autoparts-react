// Configuración de Karma + Jasmine para probar componentes React.
// Karma no entiende JSX por sí solo: webpack + babel lo transforman antes de ejecutar las pruebas
// y babel-plugin-istanbul mide la cobertura del código de src/.
const webpack = require("webpack");

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "webpack"],
    files: [{ pattern: "test/index.js", watched: false }],
    preprocessors: { "test/index.js": ["webpack"] },

    webpack: {
      mode: "development",
      devtool: false,
      resolve: { extensions: [".js", ".jsx"] },
      // Create React App define PUBLIC_URL; aquí se define igual para que el código funcione en las pruebas
      plugins: [new webpack.DefinePlugin({ "process.env.PUBLIC_URL": JSON.stringify("") })],
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env", { targets: { chrome: "100" } }],
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
                // instrumenta solo el código de src/ para el reporte de cobertura
                plugins: [["istanbul", { exclude: ["test/**"] }]],
              },
            },
          },
        ],
      },
    },

    reporters: ["spec", "coverage"],
    coverageReporter: {
      dir: "coverage",
      reporters: [
        { type: "html", subdir: "html" },
        { type: "text-summary" },
        { type: "text", subdir: ".", file: "cobertura.txt" },
        { type: "lcovonly", subdir: ".", file: "lcov.info" },
      ],
    },

    browsers: ["ChromeHeadlessCI"],
    customLaunchers: { ChromeHeadlessCI: { base: "ChromeHeadless", flags: ["--no-sandbox"] } },
    client: { jasmine: { random: true } },
    singleRun: false,
    restartOnFileChange: true,
  });
};
