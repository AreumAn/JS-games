const col = 4;
const row = 3;
const colors = ['red', 'orange', 'green', 'yellow', 'purple', 'blue'];
const wrapper = document.querySelector('#wrapper');

let done = 0;
let clickedCard = [];
let ableToClick = false;

const shuffleArray = (arr) =>
  arr
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);

// Check if flipped cards are same color
const checkSameColor = () => {
  if (
    clickedCard[0].querySelector('.card-back').style.backgroundColor ===
    clickedCard[1].querySelector('.card-back').style.backgroundColor
  ) {
    // Same color
    clickedCard[0].classList.add('done');
    clickedCard[1].classList.add('done');
    done += 2;
  } else {
    // Not same
    // flip to show front of card
    clickedCard[0].classList.remove('flipped');
    clickedCard[1].classList.remove('flipped');
  }

  clickedCard = [];
  ableToClick = true;

  // Check if the game is done
  if (done === col * row) {
    alert('Good Job!');
    resetGame();
  }
};

// Restart game
const resetGame = () => {
  wrapper.innerHTML = '';
  done = 0;
  clickedCard = [];
  ableToClick = false;
  setCards(col, row);
};

// Draw cards with click event
const setCards = (col, row) => {
  let cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');

  // Make pairs of colors and shuffle
  const shuffledColors = shuffleArray(colors.concat(colors));

  for (let i = 0; i < col * row; i++) {
    // Draw card
    let card = document.createElement('div');
    card.classList.add('card');
    let cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');
    let cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    let cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    // Add color
    cardBack.style.backgroundColor = shuffledColors[i];
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    // Add click event
    card.addEventListener('click', () => {
      if (!ableToClick) return;

      // Flip card
      card.classList.toggle('flipped');

      if (clickedCard.length === 1 && clickedCard[0] === card) {
        // The user click twice on same card
        clickedCard = [];
        return;
      }

      clickedCard.push(card);

      if (clickedCard.length === 2) {
        // Check if clicked card is the same color as flipped card
        ableToClick = false;
        setTimeout(() => {
          checkSameColor();
        }, 500);
      }
    });

    cardContainer.appendChild(card);
  }
  wrapper.appendChild(cardContainer);

  // Show card when the user game starts
  document.querySelectorAll('.card').forEach((card, index) => {
    setTimeout(function () {
      card.classList.add('flipped');
    }, 500 + 100 * index);
  });

  // hide cards to start play a game
  document.querySelectorAll('.card').forEach((card) => {
    setTimeout(function () {
      card.classList.remove('flipped');
      ableToClick = true;
    }, 5000);
  });
};

setCards(col, row);
