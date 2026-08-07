import { decks, getDeckByID } from './decks.js';
import { hexToString } from './colors.js';
import { renderCarouselView } from './carousel.js';
import { renderDeckView } from './deck-view.js';
import { renderNewDeckView } from './new-deck-view.js';

const homeSection = document.querySelector('#home');
const deckViewSection = document.querySelector('#deck-view');
const carouselSection = document.querySelector('#carousel');
const newDeckSection = document.querySelector('#new-deck-view');
const notFoundSection = document.querySelector('#not-found');
const pageEl = document.querySelector('.page');
const pageMainContent = document.querySelector('.page__main-content');
const newDeckBtn = document.querySelector('#home .gallery__new-card-btn');
newDeckBtn.addEventListener('click', () => {
  window.location.hash = 'new-deck-view';
});

function renderHomeView() {
  homeSection.style.display = 'flex';
  deckViewSection.style.display = 'none';
  carouselSection.style.display = 'none';
  newDeckSection.style.display = 'none';
  notFoundSection.style.display = 'none';
  pageMainContent.classList.remove('page__main-content_location_carousel');
  pageEl.classList.remove('page_no-mobile-bar');
}

function renderMyDeckView(deck) {
  homeSection.style.display = 'none';
  deckViewSection.style.display = 'none';
  carouselSection.style.display = 'flex';
  newDeckSection.style.display = 'none';
  notFoundSection.style.display = 'none';
  pageMainContent.classList.add('page__main-content_location_carousel');
  pageEl.classList.add('page_no-mobile-bar');
  renderCarouselView(deck);
}

function renderMyNewDeckView(deck) {
  homeSection.style.display = 'none';
  deckViewSection.style.display = 'none';
  carouselSection.style.display = 'none';
  newDeckSection.style.display = 'flex';
  notFoundSection.style.display = 'none';
  pageMainContent.classList.add('page__main-content_location_carousel');
  pageEl.classList.add('page_no-mobile-bar');
  renderNewDeckView();
}

function renderNotFoundView() {
  homeSection.style.display = 'none';
  deckViewSection.style.display = 'none';
  carouselSection.style.display = 'none';
  newDeckSection.style.display = 'none';
  notFoundSection.style.display = 'block';
  pageMainContent.classList.remove('page__main-content_location_carousel');
  pageEl.classList.remove('page_no-mobile-bar');
}

function router() {
  const hash = window.location.hash.slice(1) || 'home';
  if (hash === 'home' || hash === '') {
    return renderHomeView();
  } else if (hash.startsWith('deck/')) {
    const deckId = hash.split('/')[1];
    const deck = getDeckByID(deckId);
    if (!deck) {
      return renderNotFoundView();
    }
    return renderDeckView(deck);
  } else if (hash.startsWith('carousel/')) {
    const deckId = hash.split('/')[1];
    const deck = getDeckByID(deckId);
    if (!deck) {
      return renderNotFoundView();
    }
    return renderMyDeckView(deck);
  } else if (hash === 'new-deck-view') {
    return renderMyNewDeckView();
  } else {
    return renderNotFoundView();
  }
}

window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);

function createDeckEl(item) {
  const templateEl = document.querySelector('#deck-template');
  const deckEl = templateEl.content.querySelector('.card').cloneNode(true);
  const deckLink = deckEl.querySelector('.card__link');
  deckLink.href = `#deck/${item.id}`;
  const deckTitleEl = deckEl.querySelector('.card__title');
  deckTitleEl.textContent = item.name;
  const deckCount = deckEl.querySelector('.card__count');
  deckCount.textContent = `${item.cards.length} Cards`;
  const deckDeleteBtnEl = deckEl.querySelector('.card__btn_type_delete');
  deckDeleteBtnEl.addEventListener('click', () => {
    deckEl.remove();
  });
  const deckColor = hexToString(item.color);
  deckEl.classList.add(`card_color_${deckColor}`);

  return deckEl;
}

function renderDeckEl(item) {
  const deckEl = createDeckEl(item);
  const containerEl = document.querySelector('#home .gallery__list');
  containerEl.prepend(deckEl);
}

decks.forEach((deck) => {
  renderDeckEl(deck);
});
