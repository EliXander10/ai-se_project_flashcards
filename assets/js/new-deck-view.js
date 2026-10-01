import { fetchedDecks } from './decks.js';
import { addDeck } from './api.js';

const NewDeckForm = document.querySelector('#new-deck-view__form');
const NewDeckFormSubmitBtn = NewDeckForm.querySelector('.new-deck-view__create-deck-btn');
const errorModal = document.querySelector('#error-modal');
const errorModalMessage = errorModal.querySelector('.modal__error');
const errorModalCloseBtn = errorModal.querySelector('.modal__close');
errorModalCloseBtn.addEventListener('click', () => {
  errorModal.classList.remove('modal_visible');
  errorModalMessage.textContent = '';
});

/** Displays the new-deck form and hides the other application views.
 * @returns {void}
 */
function renderNewDeckView() {
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

  homeSection.style.display = 'none';
  deckViewSection.style.display = 'none';
  carouselSection.style.display = 'none';
  newDeckSection.style.display = 'flex';
  aboutSection.style.display = 'none';
  notFoundSection.style.display = 'none';
  pageMainContent.classList.add('page__main-content_location_carousel');
  pageEl.classList.add('page_no-mobile-bar');
}

/** Displays an error message in the modal.
 * @param {string} message - The message to show.
 * @returns {void}
 */
function showError(message) {
  errorModal.classList.add('modal_visible');
  errorModalMessage.textContent = message;
}

/** Parses JSON text, returning null when parsing fails.
 * @param {string} jsonString - The JSON text to parse.
 * @returns {unknown|null} The parsed value, or null for invalid JSON.
 */
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

  /** Validates a deck name against the accepted length and type.
   * @param {unknown} name - The proposed deck name.
   * @returns {string|undefined} The valid name, or undefined when invalid.
   */
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

  addDeck(NAME, color, jsonData.cards)
    .then((newDeck) => {
      fetchedDecks.push(newDeck);
      window.location.hash = 'deck/' + newDeck._id;
    })
    .catch(showError);
});

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

/**
/**
 * Returns a consistent lowercase hex color string with a leading "#".
 * Accepts values with or without a leading "#". Returns "#64d583" as a
 * fallback if the value is missing or not a valid 6-digit hex.
 *
 * @param {string|undefined} color - The color value to normalize.
 * @returns {string} The normalized 6-digit hex color.
 */
function normalizeColor(color) {
  if (!color) return '#64d583';
  const hex = color.startsWith('#') ? color.slice(1) : color;
  if (!HEX_DIGITS.test(hex)) return '#64d583';
  return '#' + hex.toLowerCase();
}

/** Enables the new-deck form's submit button.
 * @returns {void}
 */
function disabledSubmitBtn() {
  NewDeckFormSubmitBtn.disabled = false;
}

export { renderNewDeckView, normalizeColor, disabledSubmitBtn, showError };
