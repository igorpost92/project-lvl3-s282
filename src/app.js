import 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Model from './model';
import { showError, renderContent, renderInputStatus } from './renderers';

const state = new Model();

export default () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const link = data.get('link');
    const isValid = state.isLinkValid(link);

    if (!isValid) {
      return;
    }

    state.addChannel(link);
  });

  document.addEventListener('feedWasAdded', () => renderContent(state));
  document.addEventListener('rssError', () => showError('Произошла ошибка при загрузке ресурса!'));

  const input = document.querySelector('input[name="link"]');
  input.addEventListener('input', ({ target }) => {
    const link = target.value;
    const isValid = state.isLinkValid(link);

    renderInputStatus(isValid);
  });
};
