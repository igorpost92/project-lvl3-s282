import { isURL } from 'validator';

const parseData = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');

  const title = doc.querySelector('title').textContent;
  const desc = doc.querySelector('description').textContent;

  const news = [...doc.querySelectorAll('item')]
    .map((item) => {
      const article = {};
      article.title = item.querySelector('title').textContent;
      article.text = item.querySelector('description').textContent;
      article.link = item.querySelector('link').textContent;
      return article;
    });

  return { title, desc, news };
};

export const isLinkValid = link => isURL(link, { protocols: ['http', 'https'] });

export default (link) => {
  if (!isLinkValid(link)) {
    return Promise.reject(new Error('List is incorrect'));
  }

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
