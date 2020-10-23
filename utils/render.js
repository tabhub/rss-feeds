const art = require('art-template');
const path = require('path');

const render = (data) => {
  let xml = "";

  try {
    let template = path.resolve(__dirname, '../views/rss.art');
    xml = art(template, data);
  } catch (error) {
    console.log(error);
  }

  return xml;
}

module.exports = render;
