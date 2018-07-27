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

export const renderArticles = (articles) => {
  const html = articles.map(({ title }) => `
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

  document.getElementById('news').innerHTML = html;
};

export const renderContent = ({ feeds, articles }) => { // TODO:
  document.getElementById('link-field').value = '';

  renderFeeds(feeds);
  renderArticles(articles);
};

export const renderInputStatus = (isValid) => {
  const input = document.querySelector('input[name="link"]');
  input.classList.toggle('is-invalid', !isValid);
};

export const renderModal = ({ title, text }) => {
  const modal = document.getElementById('details');
  modal.querySelector('.modal-title').textContent = title;
  modal.querySelector('.modal-body').textContent = text;
};
