import readRSS from './reader';

export default class State {
  constructor() {
    this.feeds = [];
    this.articles = [];
    this.info = { status: '', text: '' };
  }

  addChannel(link) {
    return readRSS(link)
      .then(({ news, ...feed }) => {
        this.feeds.push({ ...feed, link });
        this.articles.unshift(...news);
        this.info = { status: 'success', text: 'Загрузка завершена.' };
      })
      .catch(() => {
        this.info = { status: 'danger', text: 'Произошла ошибка при загрузке ресурса!' };
      });
  }

  hasFeed(link) {
    return this.feeds.some(feed => feed.link === link);
  }
}
