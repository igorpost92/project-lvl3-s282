export default class State {
  cache = new Set();

  constructor() {
    this.feeds = [];
    this.articles = [];
    this.info = { status: '', text: '' };
  }

  addFeed(feed) {
    this.feeds.push(feed);
  }

  addArticles(articles) {
    const newItems = articles.filter(({ link }) => !this.cache.has(link));
    if (!newItems.length) {
      return;
    }

    newItems.forEach(({ link }) => this.cache.add(link));
    this.articles.unshift(...newItems);
  }

  setInfoMessage(status, text) {
    this.info = { status, text };
  }

  hasFeed(link) {
    return this.feeds.some(feed => feed.link === link);
  }
}
