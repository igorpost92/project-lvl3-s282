import $ from 'jquery';

const parseData = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const xml = $(doc);

  const title = xml.find('title:first').first().text();
  const desc = xml.find('description').first().text();

  const news = xml.find('item')
    .map((index, el) => {
      const item = $(el);

      const article = {};
      article.title = item.find('title').text();
      article.desc = item.find('description').text();
      return article;
    })
    .toArray();

  return { title, desc, news };
};

export default (link) => {
  const proxy = 'https://cors-anywhere.herokuapp.com/';

  return fetch(`${proxy}${link}`)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`code ${res.status}: ${res.statusTest}`);
      }
      return res.text();
    })
    .then((data) => {
      const feed = parseData(data);
      return feed;
    });
};
