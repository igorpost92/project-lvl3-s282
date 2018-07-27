import $ from 'jquery';
import _ from 'lodash';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';

import State from './state';
import readRSS, { isLinkValid } from './reader';
import {
  renderInfoMessage, renderFeeds, renderArticles, renderInputStatus, renderModal,
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
  })
  .catch(() => state.setInfoMessage('danger', 'Произошла ошибка при загрузке ресурса!'));

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

  loadContent(link);
};

const onInput = ({ target }) => {
  const link = target.value;
  const isValid = link === '' || (isLinkValid(link) && !state.hasFeed(link));

  renderInputStatus(isValid);
};

const onNewsClick = (e) => {
  const item = e.relatedTarget.closest('.list-group-item');
  const ind = _.findIndex(document.getElementById('news').children, el => el === item);

  if (ind < 0) {
    state.info = { status: 'danger', text: 'Блиныч! Неизвестная ошибка.' };
    return;
  }

  renderModal(state.articles[ind]);
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

  $('#details').on('show.bs.modal', onNewsClick);

  watch(state, 'feeds', () => renderFeeds(state.feeds));
  watch(state, 'articles', () => renderArticles(state.articles));
  watch(state, 'info', () => renderInfoMessage(state.info));

  refreshContent();
};
