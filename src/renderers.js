import $ from 'jquery';
import _ from 'lodash';

export const renderInfoMessage = ({ status, text }) => {
  const message = text === '' ? '' : `
  <div class="alert alert-${status} fade show rounded" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
    <p class="mb-0">${text}</p>
  </div>
  `;

  document.getElementById('messages').innerHTML = message;
};

export const renderFeeds = (feeds) => {
  const html = feeds.map(({ title, desc }) => `
    <li class="list-group-item">
      <h5>${title}</h5>
      <p class="mb-1">${desc}</p>
    </li>
    `)
    .join('\n');

  document.getElementById('feeds').innerHTML = html;
};

const onNewsClick = ({ target }, showArticle) => {
  const item = target.closest('.list-group-item');
  const ind = _.findIndex(document.getElementById('news').children, el => el === item);

  showArticle(ind);
};

// TODO: rerendrer only new items
export const renderArticles = (articles, showArticle) => {
  const html = articles.map(({ title }) => `
    <li class="list-group-item d-flex my-1">
      <button type="button" class="btn btn-info rounded-circle" data-toggle="modal">
        ...
      </button>
      <div class="d-flex flex-column justify-content-center ml-3">
        ${title}
      </div>
    </li>
    `)
    .join('\n');

  document.getElementById('news').innerHTML = html;

  const buttons = document.querySelectorAll('button[data-toggle="modal"]');

  buttons.forEach((button) => {
    button.addEventListener('click', e => onNewsClick(e, showArticle));
  });
};

export const renderInputStatus = (status) => {
  const isInvalid = status === 'invalid';
  const input = document.getElementById('link-field');
  input.classList.toggle('is-invalid', isInvalid);

  if (status === 'empty') {
    input.value = '';
  }
};

export const showModal = ({ title, text }) => {
  const modal = document.getElementById('details');
  modal.querySelector('.modal-title').textContent = title;
  modal.querySelector('.modal-body').textContent = text;

  $(modal).modal('show');
};

export const renderLoading = (isLoading) => {
  const button = document.querySelector('button[type="submit"]');
  button.disabled = isLoading;
  button.textContent = isLoading ? 'Загрузка...' : 'Добавить';
};
