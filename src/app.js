import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { isURL } from 'validator';

import read from './reader';
import './mystyle.css';

const state = {
  channels: [],
  news: [],
  wasError: false,
};

const isLinkValid = (link) => {
  const isLink = isURL(link, { protocols: ['http', 'https'] });
  const isExist = state.channels.some(channel => channel.link === link);
  const isValid = isLink && !isExist;
  return isValid;
};

const showError = () => {
  $('#error-message, #link-field').toggleClass('error', state.wasError);
};

const render = () => {
  $('#link-field').val('');

  const createItem = ({ title, desc }) => {
    const item = $(document.createElement('li')).addClass('item');

    const header = document.createElement('h5');
    $(header).text(title).appendTo(item);

    const text = document.createElement('p');
    $(text).text(desc).appendTo(item);

    return item;
  };

  const feedList = $('#feed-list');
  feedList.html('');
  state.channels.forEach(channel => createItem(channel).appendTo(feedList));

  const newsList = $('#news-list');
  newsList.html('');
  state.news.forEach(article => createItem(article).appendTo(newsList));
};

const addChannel = (link) => {
  read(link)
    .then(({ news, ...channel }) => {
      state.channels.push({ ...channel, link });
      state.news = news.concat(state.news);

      render();

      state.wasError = false;
      showError();
    })
    .catch(() => {
      state.wasError = true;
      showError();
    });
};

export default () => {
  $('#new-feed').on('submit', function submit(e) {
    e.preventDefault();
    const data = new FormData(this);
    const link = data.get('link');
    const isValid = isLinkValid(link);

    if (!isValid) {
      return;
    }

    addChannel(link);
  });

  $('#link-field').on('input', ({ target }) => {
    const link = target.value;
    const isValid = isLinkValid(link);

    target.classList.toggle('is-invalid', !isValid);
    $('#add-new').prop('disabled', !isValid);
  });
};
