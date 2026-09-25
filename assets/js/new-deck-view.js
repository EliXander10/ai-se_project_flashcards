import { decks } from './decks.js';

const NewDeckForm = document.querySelector('#new-deck-view__form');
// const NewDeckFormTextArea = NewDeckForm.querySelector('.new-deck-view__text-label__textarea');
const NewDeckFormSubmitBtn = NewDeckForm.querySelector('.new-deck-view__create-deck-btn');
const errorModal = document.querySelector('#error-modal');
const errorModalMessage = errorModal.querySelector('.modal__error');
const errorModalCloseBtn = errorModal.querySelector('.modal__close');
errorModalCloseBtn.addEventListener('click', () => {
  errorModal.classList.remove('modal_visible');
  errorModalMessage.textContent = '';
});

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

function showError(message) {
  errorModal.classList.add('modal_visible');
  errorModalMessage.textContent = message;
}

function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

NewDeckForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const values = Object.fromEntries(formData);
  const jsonData = parseJSON(values.text);
  const isObject = jsonData !== null && typeof jsonData === 'object' && !Array.isArray(jsonData);

  if (!isObject) {
    showError('is not vaild json should be an object');
    return;
  }

  function validateName(name) {
    if (typeof name != 'string' || name.length < 2 || name.length > 80) {
      showError('must be a string between 2-80 characters long');
      return;
    }
    return name;
  }

  const NAME = validateName(jsonData.name);
  if (!NAME) {
    return;
  }
  const ID = `${slugify(NAME)}-${Date.now()}`;

  const color = normalizeColor(values.color);

  if (typeof jsonData.color === 'string') {
    const textAreaColor = normalizeColor(jsonData.color);
    if (textAreaColor !== color) {
      showError('json color does not match the color picked');
      return;
    }
  }

  if (!Array.isArray(jsonData.cards)) {
    showError('cards is not an array');
    return;
  }

  decks.push({
    id: ID,
    color: color,
    name: NAME,
    cards: jsonData.cards,
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

export { renderNewDeckView, slugify, normalizeColor, disableSubmitBtn, showError };
