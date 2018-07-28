export default class State {
  constructor() {
    this.feeds = [];
    this.articles = [];
    this.info = { status: '', text: '' };
    this.inputStatus = 'empty';
    this.isLoading = false;

    this.links = new Set();
  }

  addFeed(feed) {
    this.feeds.push(feed);
  }

  addArticles(articles) {
    const newItems = articles.filter(({ link }) => !this.links.has(link));
    if (!newItems.length) {
      return;
    }

    newItems.forEach(({ link }) => this.links.add(link));
    this.articles.unshift(...newItems);
  }

  setInfoMessage(status, text) {
    this.info = { status, text };
  }

  setInputStatus(status) {
    this.inputStatus = status;
  }

  setLoadingStatus(isLoading) {
    this.isLoading = isLoading;
  }

  hasFeed(link) {
    return this.feeds.some(feed => feed.link === link);
  }
}
