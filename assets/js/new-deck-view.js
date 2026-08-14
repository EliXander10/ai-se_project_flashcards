import { decks } from './decks.js';

const NewDeckForm = document.querySelector('#new-deck-view__form');
const NewDeckFormTextArea = NewDeckForm.querySelector('.new-deck-view__text-label__textarea');
const NewDeckFormSubmitBtn = NewDeckForm.querySelector('.new-deck-view__create-deck-btn');

function renderNewDeckView() {
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

  homeSection.style.display = 'none';
  deckViewSection.style.display = 'none';
  carouselSection.style.display = 'none';
  newDeckSection.style.display = 'flex';
  notFoundSection.style.display = 'none';
  pageMainContent.classList.add('page__main-content_location_carousel');
  pageEl.classList.add('page_no-mobile-bar');
}

NewDeckForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const values = Object.fromEntries(formData);
  const color = normalizeColor(values.color);
  const jasonData = JSON.parse(values.text);
  const ID = `${slugify(jasonData.name)}-${Date.now()}`;
  decks.push({
    id: ID,
    color: color,
    name: jasonData.name,
    cards: jasonData.cards,
  });
  window.location.hash = 'deck/' + ID;
});

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

/**
 * Converts a string to a URL-safe slug: lowercase with any run of
 * non-alphanumeric characters replaced by a single hyphen, and no leading or
 * trailing hyphens.
 *
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Returns a consistent lowercase hex color string with a leading "#".
 * Accepts values with or without a leading "#". Returns "#64d583" as a
 * fallback if the value is missing or not a valid 6-digit hex.
 *
 * @param {string|undefined} color
 * @returns {string}
 */
function normalizeColor(color) {
  if (!color) return '#64d583';
  const hex = color.startsWith('#') ? color.slice(1) : color;
  if (!HEX_DIGITS.test(hex)) return '#64d583';
  return '#' + hex.toLowerCase();
}

function disableSubmitBtn() {
  NewDeckFormSubmitBtn.disabled = false;
}

export { renderNewDeckView, slugify, normalizeColor, disableSubmitBtn };
