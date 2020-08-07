const field = document.querySelector('.field');
const fieldRect = field.getBoundingClientRect();
const timer = document.querySelector('.timer');
const result = document.querySelector('.result');
const popUp = document.querySelector('.pop-up');
const startBtn = document.querySelector('#startBtn');
const replayBtn = document.querySelector('.replay');
const resultText = document.querySelector('.result-text');

const sound_carrot = new Audio('./sound/carrot_pull.mp3');
const sound_bug = new Audio('./sound/bug_pull.mp3');
const sound_win = new Audio('./sound/game_win.mp3');
const sound_bg = new Audio('./sound/bg.mp3');
const sound_alert = new Audio('./sound/alert.wav');

const CARROT = 'carrot';
const BUG = 'bug';
const ITEM_SIZE = 83;
const CARROT_NUM = 5;
const TIME_DURATION = 60;
const LOSE_MSG = 'You lose';
const WIN_MSG = 'You win';

let interval;
let playingGame = false;
let leftCarrot = CARROT_NUM;

const initGame = () => {
  playingGame = !playingGame;
  if (!playingGame) {
    resetGame();
  } else {
    startGame();
  }
};

const startGame = () => {
  palySound(sound_bg);
  spreadItems(CARROT, CARROT_NUM, './img/carrot.png');
  spreadItems(BUG, CARROT_NUM, './img/bug.png');

  field.addEventListener('click', onClickItem);
  showSetting();

  timer.textContent = '01:00';
  leftCarrot = CARROT_NUM;
  result.textContent = leftCarrot;

  decreaseTime(TIME_DURATION);
};

const showSetting = () => {
  timer.style.visibility = 'visible';
  result.style.visibility = 'visible';
};

const resetGame = () => {
  clearInterval(interval);
  stopSound(sound_bg);
  field.innerHTML = '';
  initGame();
};

const stopGame = (msg) => {
  stopSound(sound_bg);
  palySound(sound_alert);
  popUp.classList.remove('hide');
  if (msg === WIN_MSG) {
    palySound(sound_win);
  } else {
    palySound(sound_bug);
  }
  resultText.textContent = msg;
  clearInterval(interval);
};

const decreaseTime = (time) => {
  interval = setInterval(() => {
    if (time <= 0) {
      stopGame(LOSE_MSG);
    } else {
      time -= 1;
      timer.textContent = time > 9 ? `00:${time}` : `00:0${time}`;
    }
  }, 1000);
};

const spreadItems = (item, count, imgPath) => {
  for (let i = 0; i < count; i++) {
    const leftOffset = Math.floor(
      Math.random() * (fieldRect.width - ITEM_SIZE)
    );
    const topOffset = Math.floor(
      Math.random() * (fieldRect.height - ITEM_SIZE)
    );
    const elementDiv = document.createElement('img');
    elementDiv.setAttribute('class', `field-items ${item}`);
    elementDiv.setAttribute('src', imgPath);
    elementDiv.style.left = `${leftOffset}px`;
    elementDiv.style.top = `${topOffset}px`;
    field.appendChild(elementDiv);
  }
};

const onClickItem = (event) => {
  const target = event.target;
  if (target.classList[1] === CARROT) {
    target.remove();
    result.textContent = --leftCarrot;
    if (leftCarrot === 0) stopGame(WIN_MSG);
  } else if (target.classList[1] === BUG) {
    stopGame(LOSE_MSG);
  }
};

const palySound = (sound) => {
  sound.currentTime = 0;
  sound.play();
};

const stopSound = (sound) => {
  sound.pause();
};

startBtn.addEventListener('click', () => {
  initGame();
});

replayBtn.addEventListener('click', () => {
  popUp.classList.add('hide');
  initGame();
});
