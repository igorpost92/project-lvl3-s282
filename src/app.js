import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';

import State from './State';
import readRSS, { isLinkValid } from './reader';
import {
  renderInfoMessage, renderFeeds, renderArticles, renderInputStatus, showModal, renderLoading,
} from './renderers';


// TODO: content-loader - think about own module

const loadData = link => readRSS(link)
  .then(({ articles, ...feed }) => {
    const newFeed = { ...feed, link };
    return { feed: newFeed, articles };
  });

const loadContent = (link, state) => loadData(link)
  .then(({ feed, articles }) => {
    state.addFeed(feed);
    state.addArticles(articles);
    state.setInfoMessage('success', 'Загрузка завершена.');
    state.setInputStatus('empty');
  })
  .catch(() => state.setInfoMessage('danger', 'Произошла ошибка при загрузке ресурса!'))
  .finally(() => state.setLoadingStatus(false));

const updateContent = (state) => {
  const links = state.feeds.map(({ link }) => link);
  return Promise.all(links.map(loadData))
    .then((data) => {
      if (!data.length) {
        return;
      }

      data.forEach(({ articles }) => state.addArticles(articles));
    });
};

//


const onSubmit = (form, state, e) => {
  e.preventDefault();
  const data = new FormData(form);
  const link = data.get('link');

  if (state.hasFeed(link)) {
    state.setInfoMessage('danger', 'Данный канал уже есть в списке.');
    return;
  }
  if (!isLinkValid(link)) {
    state.setInfoMessage('danger', 'Введенная ссылка некорректна.');
    return;
  }

  state.setLoadingStatus(true);
  loadContent(link, state);
};

const onInput = (state, { target }) => {
  const link = target.value;

  if (link === '') {
    state.setInputStatus('empty');
  } else if (isLinkValid(link) && !state.hasFeed(link)) {
    state.setInputStatus('valid');
  } else {
    state.setInputStatus('invalid');
  }
};


const refreshContent = (state, refreshInterval) => {
  updateContent(state)
    .catch(() => state.setInfoMessage('danger', 'Произошла ошибка при обновлении новостей!'))
    .finally(() => setTimeout(refreshContent, refreshInterval, state));
};


export default () => {
  const state = new State();

  const form = document.querySelector('form');
  form.addEventListener('submit', onSubmit.bind(null, form, state));

  const input = document.querySelector('input[name="link"]');
  input.addEventListener('input', onInput.bind(null, state));

  $('#details').on('hide.bs.modal', () => {
    state.currentArticle = null;
  });

  watch(state, 'feeds', () => renderFeeds(state.feeds));

  watch(state, 'articles', () => {
    const showArticle = (ind) => {
      state.currentArticle = ind;
    };

    renderArticles(state.articles, showArticle);
  });

  watch(state, 'info', () => renderInfoMessage(state.info));
  watch(state, 'inputStatus', () => renderInputStatus(state.inputStatus));
  watch(state, 'isLoading', () => renderLoading(state.isLoading));

  watch(state, 'currentArticle', () => {
    const ind = state.currentArticle;
    if (ind != null) {
      showModal(state.articles[ind]);
    }
  });

  const refreshInterval = 5000;
  refreshContent(state, refreshInterval);
};
