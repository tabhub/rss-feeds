const fs = require('fs');

const dump = (path, content) => {
  fs.writeFile(path, content, err => {
    if (err) {
      return console.error(`Failed to write to file: ${err.message}.`);
    }

    console.log('Success to write to file!');
  });
}

module.exports = dump;
