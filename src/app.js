import 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';

import { model as state, isLinkValid, isLinkInList } from './model';
import { renderInfoMessage, renderContent, renderInputStatus } from './renderers';

export default () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const link = data.get('link');

    if (isLinkInList(link)) {
      state.info = { status: 'danger', text: 'Данный канал уже есть в списке.' };
      return;
    }

    if (!isLinkValid(link)) {
      state.info = { status: 'danger', text: 'Введенная ссылка некорректна.' };
      return;
    }

    state.addChannel(link);
  });

  const input = document.querySelector('input[name="link"]');
  input.addEventListener('input', ({ target }) => {
    const link = target.value;
    const isValid = link === '' || isLinkValid(link);

    renderInputStatus(isValid);
  });

  watch(state, 'feeds', () => renderContent(state));
  watch(state, 'info', () => renderInfoMessage(state.info));
};
