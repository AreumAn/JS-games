const body = document.body;

let allNums = [];

// Set all possible numbers
for (let i = 1; i < 46; i++) {
  allNums.push(i);
}

// Get 7 numbers for lotto
let results = [];
for (let i = 0; i < 7; i++) {
  const idx = Math.floor(Math.random() * allNums.length);
  results.push(allNums[idx]);
  allNums = allNums.splice(0, idx - 1).concat(allNums.splice(1));
}

let result = document.querySelector("#result");
let titles = document.querySelectorAll(".titles");

// Get color depends on num
function getColor(num) {
  let backgroundColor;
  if (num <= 10) {
    backgroundColor = "red";
  } else if (num <= 20) {
    backgroundColor = "orange";
  } else if (num <= 30) {
    backgroundColor = "yellow";
  } else if (num <= 40) {
    backgroundColor = "green";
  } else {
    backgroundColor = "blue";
  }
  return backgroundColor;
}

// Draw Ball with number
function drawBall(num, result) {
  let ball = document.createElement("div");
  ball.textContent = num;
  ball.className = "ball";
  ball.style.background = getColor(num);
  result.appendChild(ball);
}

// show number ball every 1 sec
for (let i = 0; i < results.length - 1; i++) {
  (function draw(j) {
    setTimeout(() => {
      if (i === 0) {
        titles[0].style.display = "block";
      }
      drawBall(results[i], result);
    }, (j + 1) * 1000);
  })(i);
}

// Draw bonus ball
setTimeout(function drawBonus() {
  titles[1].style.display = "block";
  var bonusDiv = document.querySelector(".bonus");
  drawBall(results[results.length - 1], bonusDiv);
}, 7000);
