import { isURL } from 'validator';

import readRSS from './reader';

const feedWasAdded = new Event('feedWasAdded');

export default class Model {
  constructor() {
    this.feeds = [];
    this.news = [];
  }

  isLinkValid(link) {
    const isLink = isURL(link, { protocols: ['http', 'https'] });
    const isExist = this.feeds.some(channel => channel.link === link);
    const isValid = isLink && !isExist;

    return isValid;
  }

  addChannel(link) {
    return readRSS(link)
      .then(({ news, ...feed }) => {
        this.feeds.push({ ...feed, link });
        this.news = news.concat(this.news);

        document.dispatchEvent(feedWasAdded);
      })
      .catch(() => {
        // showError('Произошла ошибка при загрузке ресурса!'); // TODO:
      });
  }
}
