import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';

import State from './state';
import readRSS, { isLinkValid } from './reader';
import {
  renderInfoMessage, renderFeeds, renderArticles, renderInputStatus, showModal, renderLoading,
} from './renderers';


let state;

// TODO: content-loader - think about own module

const loadData = link => readRSS(link)
  .then(({ articles, ...feed }) => {
    const newFeed = { ...feed, link };
    return { feed: newFeed, articles };
  });

const loadContent = link => loadData(link)
  .then(({ feed, articles }) => {
    state.addFeed(feed);
    state.addArticles(articles);
    state.setInfoMessage('success', 'Загрузка завершена.');
    state.setInputStatus('empty');
  })
  .catch(() => state.setInfoMessage('danger', 'Произошла ошибка при загрузке ресурса!'))
  .finally(() => {
    state.isLoading = false;
  });

const updateContent = () => {
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


const onSubmit = (e, form) => {
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

  state.isLoading = true;
  loadContent(link);
};

const onInput = ({ target }) => {
  const link = target.value;

  if (link === '') {
    state.setInputStatus('empty');
  } else if (isLinkValid(link) && !state.hasFeed(link)) {
    state.setInputStatus('valid');
  } else {
    state.setInputStatus('invalid');
  }
};


const refreshInterval = 5000;

const refreshContent = () => {
  updateContent()
    .catch(() => state.setInfoMessage('danger', 'Произошла ошибка при обновлении новостей!'))
    .finally(() => setTimeout(refreshContent, refreshInterval));
};


export default () => {
  state = new State();

  const form = document.querySelector('form');
  form.addEventListener('submit', e => onSubmit(e, form));

  const input = document.querySelector('input[name="link"]');
  input.addEventListener('input', onInput);

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

  refreshContent();
};
