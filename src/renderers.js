export const renderInfoMessage = ({ status, text }) => {
  const message = text === '' ? '' : `
  <div class="alert alert-${status} fade show rounded" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
    <p class="mb-0">${text}</p>
  </div>
  `;

  document.querySelector('#messages').innerHTML = message;
};

const renderFeeds = (feeds) => {
  const html = feeds.map(({ title, desc }) => `
    <li class="list-group-item">
      <h5>${title}</h5>
      <p class="mb-1">${desc}</p>
    </li>
    `)
    .join('\n');

  document.querySelector('#feeds').innerHTML = html;
};

const renderNews = (news) => {
  const html = news.map(({ title }) => `
    <li class="list-group-item d-flex my-1">
      <button type="button" class="btn btn-info rounded-circle" data-toggle="modal" data-target="#details">
        ...
      </button>
      <div class="d-flex flex-column justify-content-center ml-3">
        ${title}
      </div>
    </li>
    `)
    .join('\n');

  document.querySelector('#news').innerHTML = html;

  // TODO:
  //
  // data-title="${title}" data-text="${text}" --- to use or not to use?
  //
  // $('#details').on('show.bs.modal', function show(event) {
  //   const button = $(event.relatedTarget);
  //   const title = button.data('title');
  //   const text = button.data('text');
  //   const modal = $(this);
  //   modal.find('.modal-title').text(title);
  //   modal.find('.modal-body').text(text);
  // });
};

export const renderContent = ({ feeds, news }) => {
  document.querySelector('#link-field').value = '';

  renderFeeds(feeds);
  renderNews(news);
};

export const renderInputStatus = (isValid) => {
  const input = document.querySelector('input[name="link"]');
  input.classList.toggle('is-invalid', !isValid);
};

export const renderModal = ({ title, text }) => {
  const modal = document.querySelector('#details');
  modal.querySelector('.modal-title').textContent = title;
  modal.querySelector('.modal-body').textContent = text;
};
