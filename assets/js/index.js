import { fetchedDecks, getDeckByID } from './decks.js';
import { hexToString } from './colors.js';
import { renderCarouselView } from './carousel.js';
import { renderDeckView } from './deck-view.js';
import { renderNewDeckView, disabledSubmitBtn, showError } from './new-deck-view.js';
import { getDecks, deleteDeck } from './api.js';

const homeSection = document.querySelector('#home');
const deckViewSection = document.querySelector('#deck-view');
const carouselSection = document.querySelector('#carousel');
const newDeckSection = document.querySelector('#new-deck-view');
const aboutSection = document.querySelector('#about');
const notFoundSection = document.querySelector('#not-found');
const pageEl = document.querySelector('.page');
const pageMainContent = document.querySelector('.page__main-content');
const newDeckBtn = document.querySelector('#home .gallery__new-card-btn');
newDeckBtn.addEventListener('click', () => {
  window.location.hash = 'new-deck-view';
});

/** Displays the home view and restores the standard page layout.
 * @returns {void}
 */
function renderHomeView() {
  homeSection.style.display = 'flex';
  deckViewSection.style.display = 'none';
  carouselSection.style.display = 'none';
  newDeckSection.style.display = 'none';
  aboutSection.style.display = 'none';
  notFoundSection.style.display = 'none';
  pageMainContent.classList.remove('page__main-content_location_carousel');
  pageEl.classList.remove('page_no-mobile-bar');
}

/** Displays the carousel view for the selected deck.
 * @param {object} deck - The deck to practice.
 * @returns {void}
 */
function renderMyDeckView(deck) {
  homeSection.style.display = 'none';
  deckViewSection.style.display = 'none';
  carouselSection.style.display = 'flex';
  newDeckSection.style.display = 'none';
  aboutSection.style.display = 'none';
  notFoundSection.style.display = 'none';
  pageMainContent.classList.add('page__main-content_location_carousel');
  pageEl.classList.add('page_no-mobile-bar');
  renderCarouselView(deck);
}

/** Displays the new-deck form.
 * @returns {void}
 */
function renderMyNewDeckView() {
  renderNewDeckView();
}

/** Displays the about view and restores the standard page layout.
 * @returns {void}
 */
function renderAboutView() {
  homeSection.style.display = 'none';
  deckViewSection.style.display = 'none';
  carouselSection.style.display = 'none';
  newDeckSection.style.display = 'none';
  aboutSection.style.display = 'flex';
  notFoundSection.style.display = 'none';
  pageMainContent.classList.remove('page__main-content_location_carousel');
  pageEl.classList.remove('page_no-mobile-bar');
}

/** Displays the not-found view and restores the standard page layout.
 * @returns {void}
 */
function renderNotFoundView() {
  homeSection.style.display = 'none';
  deckViewSection.style.display = 'none';
  carouselSection.style.display = 'none';
  newDeckSection.style.display = 'none';
  aboutSection.style.display = 'none';
  notFoundSection.style.display = 'block';
  pageMainContent.classList.remove('page__main-content_location_carousel');
  pageEl.classList.remove('page_no-mobile-bar');
}

/** Routes the current URL hash to the matching application view.
 * @returns {void}
 */
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
    disabledSubmitBtn();
    return renderMyNewDeckView();
  } else if (hash === 'about') {
    return renderAboutView();
  } else {
    return renderNotFoundView();
  }
}

/** Removes a deck from the in-memory deck collection by ID.
 * @param {string} deckId - The deck identifier.
 * @returns {void}
 */
function removeDeckByID(deckId) {
  const index = fetchedDecks.findIndex((deck) => deck._id === deckId);
  if (index !== -1) {
    fetchedDecks.splice(index, 1);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  getDecks()
    .then((decks) => {
      decks.forEach((deck) => {
        fetchedDecks.push(deck);
        renderDeckEl(deck);
      });
    })
    .catch(showError)
    .finally(router);
});

window.addEventListener('hashchange', router);

/** Creates a deck tile with its link, color, and delete action.
 * @param {object} item - The deck data for the tile.
 * @returns {HTMLElement} The created deck element.
 */
function createDeckEl(item) {
  const templateEl = document.querySelector('#deck-template');
  const deckEl = templateEl.content.querySelector('.card').cloneNode(true);
  const deckLink = deckEl.querySelector('.card__link');
  deckLink.href = `#deck/${item._id}`;
  const deckTitleEl = deckEl.querySelector('.card__title');
  deckTitleEl.textContent = item.name;
  const deckCount = deckEl.querySelector('.card__count');
  deckCount.textContent = `${item.cards.length} Cards`;
  const deckDeleteBtnEl = deckEl.querySelector('.card__btn_type_delete');
  deckDeleteBtnEl.addEventListener('click', () => {
    deleteDeck(item._id)
      .then(() => {
        removeDeckByID(item._id);
        deckEl.remove();
      })
      .catch(showError);
  });
  const deckColor = hexToString(item.color);
  deckEl.classList.add(`card_color_${deckColor}`);

  return deckEl;
}

/** Creates and prepends a deck tile to the home gallery.
 * @param {object} item - The deck data to render.
 * @returns {void}
 */
function renderDeckEl(item) {
  const deckEl = createDeckEl(item);
  const containerEl = document.querySelector('#home .gallery__list');
  containerEl.prepend(deckEl);
}
