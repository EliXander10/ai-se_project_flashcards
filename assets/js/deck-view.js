import { hexToString } from './colors.js';

const homeSection = document.querySelector('#home');
const deckViewSection = document.querySelector('#deck-view');
const carouselSection = document.querySelector('#carousel');
const notFoundSection = document.querySelector('#not-found');
const pageMainContent = document.querySelector('.page__main-content');
const deckViewTitleEl = deckViewSection.querySelector('.gallery__title');
const deckViewListEl = deckViewSection.querySelector('.gallery__list');
const practiceBtn = deckViewSection.querySelector('.gallery__practice__btn');

function createDeckCardEl(card, deckColor) {
  const templateEl = document.querySelector('#card-template');
  const cardEl = templateEl.content.querySelector('.card').cloneNode(true);
  const titleEl = cardEl.querySelector('.card__title');
  const flipBtn = cardEl.querySelector('.card__btn_type_flip');
  const deleteBtn = cardEl.querySelector('.card__btn_type_delete');
  let showingQuestion = true;

  titleEl.textContent = card.question;
  cardEl.classList.add(`card_color_${deckColor}`);

  flipBtn.addEventListener('click', () => {
    showingQuestion = !showingQuestion;
    titleEl.textContent = showingQuestion ? card.question : card.answer;
    if (showingQuestion) {
      cardEl.classList.remove('card_color_white');
      cardEl.classList.add(`card_color_${deckColor}`);
    } else {
      cardEl.classList.add('card_color_white');
      cardEl.classList.remove(`card_color_${deckColor}`);
    }
  });

  deleteBtn.addEventListener('click', () => {
    cardEl.remove();
  });

  return cardEl;
}

function renderDeckCards(deck) {
  Array.from(deckViewListEl.children)
    .filter((child) => child.tagName.toLowerCase() !== 'template')
    .forEach((child) => child.remove());

  const deckColor = hexToString(deck.color);
  deck.cards.forEach((card) => {
    deckViewListEl.append(createDeckCardEl(card, deckColor));
  });
}

export function renderDeckView(deck) {
  homeSection.style.display = 'none';
  deckViewSection.style.display = 'flex';
  carouselSection.style.display = 'none';
  notFoundSection.style.display = 'none';
  pageMainContent.classList.remove('page__main-content_location_carousel');

  deckViewTitleEl.textContent = deck.name;
  renderDeckCards(deck);

  practiceBtn.onclick = () => {
    window.location.hash = `carousel/${deck.id}`;
  };
}
