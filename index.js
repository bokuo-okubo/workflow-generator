#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
// https://github.com/bpmn-io/bpmn-to-image
const { convertAll } = require("bpmn-to-image");

// util
const walking = (targetPath) => {
  const walk = (dir, done) => {
    let results = [];
    fs.readdir(dir, function (err, list) {
      if (err) return done(err);
      let i = 0;
      (function next() {
        let file = list[i++];
        if (!file) return done(null, results);
        file = path.resolve(dir, file);
        fs.stat(file, function (err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function (err, res) {
              results = results.concat(res);
              next();
            });
          } else {
            results.push(file);
            next();
          }
        });
      })();
    });
  };
  return new Promise((resolve, reject) => {
    walk(targetPath, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};
// ----------------------------------

const main = async (inputDir, outputDir, exts) => {
  const _inputDir = path.resolve(__dirname, inputDir);

  // ary created by each bpmn files.
  let pathResults = await walking(_inputDir);
  pathResults = pathResults
    .filter((r) => /^.*\.bpmn$/.test(r))
    .map((r) => ({
      full: r,
      relative: r.replace(path.resolve(__dirname, inputDir), ""),
      basename: path.basename(r),
    }));

  const params = pathResults.map((p) => {
    const tmp = p.basename.split(".")[0];
    console.log(p, tmp);
    if (!tmp) throw Error("wrong file name", p);

    const outFileNames = exts.map((ex) => [tmp, ex].join(".")); // filename.png | filename.svg
    const outputPaths = outFileNames.map((n) =>
      path.join(__dirname, outputDir, path.dirname(p.relative), n)
    );
    return {
      input: p.full,
      outputs: outputPaths,
    };
  });

  for (const { outputs } of params) {
    if (!fs.existsSync(path.dirname(outputs[0]))) {
      fs.mkdirSync(path.dirname(outputs[0]));
    }
  }

  console.log(params);

  await convertAll(params);
};

// ---------------------------
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;
// ./index.js --inputDir=./bpmn --outputDir=./out --exts=png,svg
if (argv.inputDir && argv.outputDir && argv.exts) {
  const args = [argv.inputDir, argv.outputDir, argv.exts.split(",")];
  console.log(args);
  main(...args).catch(console.error);
} else {
  console.log("wrong arguments!");
}
