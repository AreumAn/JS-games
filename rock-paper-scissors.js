// To show rock papter scissors img
const imgPositionObj = {
  rock: "-40px",
  paper: "-170px",
  scissors: "-320px",
};
let imgPosition = imgPositionObj.rock;

// To use calculation for checking winner;
const scoreToCheckWin = {
  scissors: 1,
  rock: 0,
  paper: -1,
};

// Set computer player rock paper scissors.
let interval;
function setComputerPlayerInterval() {
  interval = setInterval(() => {
    if (imgPosition === imgPositionObj.rock) {
      imgPosition = imgPositionObj.paper;
    } else if (imgPosition === imgPositionObj.paper) {
      imgPosition = imgPositionObj.scissors;
    } else {
      imgPosition = imgPositionObj.rock;
    }
    const image = document.querySelector("#computer");
    image.style.background =
      "url(./assets/rock-paper-scissor.jpg) " + imgPosition + " -470px";
    image.style.backgroundSize = "500px";
  }, 50);
}

// Start computer player
setComputerPlayerInterval();

function getComputerScore(computerPlayer) {
  // To prevent too much hard coding, get array by Object.entries() and find key by value
  return Object.entries(imgPositionObj).find((p) => {
    return p[1] === computerPlayer;
  })[0];
}

function checkWinner(player, computerPlayer) {
  let myScore = scoreToCheckWin[player];
  let comScore = scoreToCheckWin[getComputerScore(computerPlayer)];
  let diffScore = myScore - comScore;
  // If diffScore is one of winScoreArr value, play wins.
  const winScoreArr = [-1, 2];
  if (diffScore === 0) {
    alert("Same");
  } else if (winScoreArr.includes(diffScore)) {
    alert("You win");
  } else {
    alert("You lose");
  }
}

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    clearInterval(interval);
    checkWinner(btn.id, imgPosition);
    // Restart computer player
    setComputerPlayerInterval();
  });
});
