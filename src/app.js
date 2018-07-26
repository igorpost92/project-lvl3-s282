import $ from 'jquery';
import _ from 'lodash';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';

import State from './state';
import { isLinkValid } from './reader';
import {
  renderInfoMessage, renderContent, renderInputStatus, renderModal,
} from './renderers';

const state = new State();

const onSubmit = (e, form) => {
  e.preventDefault();
  const data = new FormData(form);
  const link = data.get('link');

  if (state.hasFeed(link)) {
    state.info = { status: 'danger', text: 'Данный канал уже есть в списке.' }; // TODO:
    return;
  }

  if (!isLinkValid(link)) {
    state.info = { status: 'danger', text: 'Введенная ссылка некорректна.' };
    return;
  }

  state.addChannel(link);
};

const onInput = ({ target }) => {
  const link = target.value;
  const isValid = link === '' || isLinkValid(link);

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

export default () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', e => onSubmit(e, form));

  const input = document.querySelector('input[name="link"]');
  input.addEventListener('input', onInput);

  $('#details').on('show.bs.modal', onNewsClick);

  watch(state, 'articles', () => renderContent(state));
  watch(state, 'info', () => renderInfoMessage(state.info));
};
