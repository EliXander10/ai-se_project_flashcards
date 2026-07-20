import { hexToString } from './colors.js';
import { removeColorClasses } from './colors.js';
import { decks } from './decks.js';

function renderCarouselView(deck) {
  let currentIndex = 0;
  let showingQuestion = true;

  const carouselEl = document.querySelector('.carousel');
  let leftBtn = carouselEl.querySelector('.carousel__btn_type_left');
  let rightBtn = carouselEl.querySelector('.carousel__btn_type_right');
  const carouselDeckEl = carouselEl.querySelector('.carousel__card');
  const carouselTitleEl = carouselEl.querySelector('.carousel__title');
  const carouselCardText = carouselDeckEl.querySelector('.carousel__card-text');
  let flipBtn = document.querySelector('.carousel__btn_type_flip');
  leftBtn.replaceWith(leftBtn.cloneNode(true));
  leftBtn = carouselEl.querySelector('.carousel__btn_type_left');
  rightBtn.replaceWith(rightBtn.cloneNode(true));
  rightBtn = carouselEl.querySelector('.carousel__btn_type_right');
  flipBtn.replaceWith(flipBtn.cloneNode(true));
  flipBtn = document.querySelector('.carousel__btn_type_flip');
  removeColorClasses(carouselDeckEl);
  const carouseCardColor = hexToString(deck.color);
  carouselDeckEl.classList.add(`carousel__card_color_${carouseCardColor}`);

  function getCarouselTitleString() {
    const title = `${deck.id} · ${currentIndex + 1}/${deck.cards.length}`;
    return title;
  }

  function disableButton(buttonEl) {
    buttonEl.classList.add('carousel__btn_disabled');
    buttonEl.disabled = true;
  }
  function enableButton(buttonEl) {
    buttonEl.classList.remove('carousel__btn_disabled');
    buttonEl.removeAttribute('disabled');
  }

  function updateArrows() {
    if (currentIndex === 0) {
      disableButton(leftBtn);
    } else {
      enableButton(leftBtn);
    }

    if (currentIndex === deck.cards.length - 1) {
      disableButton(rightBtn);
    } else {
      enableButton(rightBtn);
    }
  }

  function updateDisplay() {
    const currentCardQuestion = deck.cards[currentIndex].question;
    const currentCardAnswer = deck.cards[currentIndex].answer;
    console.log(currentCardQuestion);
    updateArrows();
    if (showingQuestion === true) {
      carouselDeckEl.classList.remove('carousel__card_color_white');
      return currentCardQuestion;
    } else {
      carouselDeckEl.classList.add('carousel__card_color_white');
      return currentCardAnswer;
    }
  }

  rightBtn.addEventListener('click', () => {
    if (currentIndex < deck.cards.length - 1) {
      currentIndex++;
      showingQuestion = true;
      carouselTitleEl.textContent = getCarouselTitleString();
      carouselCardText.textContent = updateDisplay();
    }
  });

  leftBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      showingQuestion = true;
      carouselTitleEl.textContent = getCarouselTitleString();
      carouselCardText.textContent = updateDisplay();
    }
  });

  flipBtn.addEventListener('click', () => {
    showingQuestion = !showingQuestion;
    carouselCardText.textContent = updateDisplay();
  });
  carouselTitleEl.textContent = getCarouselTitleString();
  carouselCardText.textContent = updateDisplay();
}

export { renderCarouselView };
