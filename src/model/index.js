import { isURL } from 'validator';

import readRSS from './reader';

export const model = {
  feeds: [],
  news: [],
  info: {
    status: '',
    text: '',
  },

  addChannel(link) {
    return readRSS(link)
      .then(({ news, ...feed }) => {
        this.feeds.push({ ...feed, link });
        this.news = news.concat(this.news);
        this.info = { status: 'success', text: 'Загрузка завершена.' };
      })
      .catch(() => {
        this.info = { status: 'danger', text: 'Произошла ошибка при загрузке ресурса!' };
      });
  },
};

export const isLinkInList = link => model.feeds.some(channel => channel.link === link);

export const isLinkValid = (link) => {
  const isLink = isURL(link, { protocols: ['http', 'https'] });
  const isExist = isLinkInList(link);
  const isValid = isLink && !isExist;

  return isValid;
};
