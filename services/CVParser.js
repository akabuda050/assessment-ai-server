const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

class CVParser {
  constructor() {
    this.parser = pdf;
  }

  async parse(pathToFile) {
    const dataBuffer = fs.readFileSync(path.resolve(pathToFile));

    return this.parser(dataBuffer).then((res) => res?.text || "");
  }
}

module.exports = {
  CVParser,
};
