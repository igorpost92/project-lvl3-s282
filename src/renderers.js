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
    <li class="list-group-item my-1">    
      <h5>${title}</h5>
      
    </li>
    `)
    .join('\n');

  // <p class="mb-1">${text}</p>
  // TODO: modal

  document.querySelector('#news').innerHTML = html;
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
