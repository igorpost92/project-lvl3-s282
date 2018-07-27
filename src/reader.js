import { isURL } from 'validator';
import { get } from 'axios';

const parseData = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');

  const title = doc.querySelector('title').textContent;
  const desc = doc.querySelector('description').textContent;

  const articles = [...doc.querySelectorAll('item')]
    .map((item) => {
      const article = {};
      article.title = item.querySelector('title').textContent;
      article.text = item.querySelector('description').textContent;
      article.link = item.querySelector('link').textContent;
      return article;
    });

  return { title, desc, articles };
};

export const isLinkValid = link => isURL(link, { protocols: ['http', 'https'] });

export default (link) => {
  if (!isLinkValid(link)) {
    return Promise.reject(new Error('List is incorrect'));
  }

  const proxy = 'https://cors-anywhere.herokuapp.com/';

  return get(`${proxy}${link}`)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`code ${res.status}: ${res.statusTest}`);
      }

      const feed = parseData(res.data);
      return feed;
    });
};
