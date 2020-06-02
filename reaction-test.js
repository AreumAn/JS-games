const screen = document.querySelector("#screen");
const title = document.querySelector("#title");
const subtitle = document.querySelector("#subtitle");
const result = document.querySelector("#result");
let startTime,
  endTime,
  timeOut = null;
let tries = [];

const classNames = {
  waiting: "waiting",
  ready: "ready",
  now: "now",
};

const texts = {
  wait: "Wait for green",
  click: "Click!",
  start: "Click to start",
  soon: "Too soon!",
  gameInfo: "When the red box turns green, click as quickly as you can.",
  again: "Click to try again!",
  keep: "Click to keep going",
};

function resetData() {
  startTime = null;
  endTime = null;
  timeOut = null;
  tries = [];
  title.textContent = texts.start;
  subtitle.textContent = texts.gameInfo;
  result.textContent = "";
}

function goToWait() {
  screen.classList.remove(classNames.waiting);
  screen.classList.add(classNames.ready);
  title.textContent = texts.wait;
  subtitle.textContent = "";
  result.textContent = "";
  // After 2 ~ 3 seconds, screen will change to green
  timeOut = setTimeout(() => {
    startTime = new Date();
    screen.click();
  }, Math.floor(Math.random() * 1000) + 2000); // 2 ~ 3 seconds
}

function goBackToWait() {
  clearTimeout(timeOut);
  screen.classList.add(classNames.waiting);
  title.textContent = texts.soon;
  subtitle.textContent = texts.again;
}

screen.addEventListener("click", () => {
  if (screen.classList.contains(classNames.waiting)) {
    // Wait(blue) page -> Red page

    if (tries.length === 5) {
      // reset data if the user tired 5 times
      resetData();
    } else {
      goToWait();
    }
  } else if (screen.classList.contains(classNames.ready)) {
    // Red page -> Green Page

    if (!startTime) {
      // Go back to ready screen, when user click red(wait) page
      goBackToWait();
    } else {
      // Go to green page
      screen.classList.add(classNames.now);
      title.textContent = texts.click;
    }
    screen.classList.remove(classNames.ready);
  } else {
    // green(click) page to result(blue, wait) page

    endTime = new Date();
    // get reaction time
    let reactionTime = endTime - startTime;
    let average = 0;
    startTime = null;
    tries.push(reactionTime);
    for (let i = 0; i < tries.length; i++) {
      average += tries[i];
    }
    // show result(blue) page style and result text
    screen.classList.remove(classNames.now);
    screen.classList.add(classNames.waiting);
    title.textContent = reactionTime + "ms";
    subtitle.textContent = tries.length === 5 ? texts.again : texts.keep;
    result.textContent = result.textContent = `Average: ${
      average / tries.length
    }ms, Tries: ${tries.length}`;
  }
});
