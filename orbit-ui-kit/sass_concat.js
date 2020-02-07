// lib
var importResolve = require("import-resolve");

// spits out a master dist file with all your wonderful stylesheet
// things concatenated

// CORE
importResolve({
  ext: "scss",
  pathToMain: "./source/core.scss",
  output: "./dist/core.scss"
});

importResolve({
  ext: "scss",
  pathToMain: "./source/imports.scss",
  output: "./dist/imports.scss"
});
