import 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { isURL } from 'validator';

import read from './reader';

const state = {
  channels: [],
  news: [],
};

const showError = (text) => {
  const errorMessage = `
  <div class="alert alert-danger fade show rounded" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
    <p class="mb-0">${text}</p>
  </div>
  `;

  document.querySelector('#messages').innerHTML = errorMessage;
};

const isLinkValid = (link) => {
  const isLink = isURL(link, { protocols: ['http', 'https'] });
  const isExist = state.channels.some(channel => channel.link === link);
  const isValid = isLink && !isExist;

  if (isExist) {
    showError('Данный канал уже добавлен в список');
  }

  return isValid;
};

const render = () => {
  document.querySelector('#messages').innerHTML = '';
  document.querySelector('#link-field').value = '';

  const createItem = ({ title, desc }) => {
    const item = document.createElement('li');
    item.className = 'list-group-item';
    item.innerHTML = `    
      <h5>${title}</h5>
      <p class="mb-1">${desc}</p>
    `;

    return item;
  };

  const feedList = document.querySelector('#feed-list');
  feedList.innerHTML = '';
  state.channels.forEach(channel => feedList.appendChild(createItem(channel)));

  const newsList = document.querySelector('#news-list');
  newsList.innerHTML = '';
  state.news.forEach(article => newsList.appendChild(createItem(article)));
};

const addChannel = (link) => {
  read(link)
    .then(({ news, ...channel }) => {
      state.channels.push({ ...channel, link });
      state.news = news.concat(state.news);

      render();
    })
    .catch(() => {
      showError('Произошла ошибка при загрузке ресурса!');
    });
};

export default () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const link = data.get('link');
    const isValid = isLinkValid(link);

    if (!isValid) {
      return;
    }

    addChannel(link);
  });

  const input = document.querySelector('input[name="link"]');
  input.addEventListener('input', ({ target }) => {
    const link = target.value;
    const isValid = isLinkValid(link);

    target.classList.toggle('is-invalid', !isValid);
    document.querySelector('#add-new').disabled = !isValid;
  });

  addChannel('https://news.rambler.ru/rss/economics/');
};
