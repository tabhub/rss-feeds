const axios = require('axios');
const downloadPage = require('../../utils/download');
const render = require('../../utils/render');
const dump = require('../../utils/dump');

const getLatestIssueNum = async () => {
  const url = 'https://perlweekly.com/';
  try {
    const html = await downloadPage(url);
    const pattern = /latest<\/a> issue \(<a href="\/archive\/(\d+)\.html">/im;
    const matched = pattern.exec(html);
    return matched[1];
  } catch (error) {
    console.error(`ERROR: ${error}`);
    return null;
  }
}

const run = async () => {
  console.log('get latest issue number...');
  const issueNum = await getLatestIssueNum();
  console.log(issueNum);
  if (!issueNum) return;

  console.log('start fetching issue data...');
  try {
    const res = await axios.get(
      `https://raw.githubusercontent.com/szabgab/perlweekly/master/src/${issueNum}.json`);
    console.log(res.data);

    if (!res.data.chapters) return;

    let items = [];
    const needTitles = ["Statistics", "Announcements", "Articles", "Code", "Web",
      "Perl Weekly Challenge", "Perl Tutorial", "Rakudo", "Weekly collections",
      "The corner of Gabor", "Events"];

    res.data.chapters.forEach((chap) => {
      if (!chap.title || !chap.entries || !needTitles.includes(chap.title)) return;

      chap.entries.forEach((entry) => {
        items.push({
          title: entry.title,
          link: entry.url,
          author: entry.author || 'PerlWeekly',
          pubDate: entry.ts,
          description: entry.text
        })
      });
    });

    const content = {
      title:  `Perl Weekly #${issueNum}`,
      description: "Hand-picked news and articles about Perl",
      link: "https://github.com/tabhub/rss-feeds",
      item: items
    };

    const xml = render(content);
    const path = "./data/perl-weekly/latest.xml";
    dump(path, xml);
  } catch (error) {
    console.log(error);
    throw(error);
  }
}

run();
