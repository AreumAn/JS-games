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

function drawBall(num, result) {
  let ball = document.createElement("div");
  console.log(num);
  ball.textContent = num;
  ball.className = "ball";
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
  ball.style.background = backgroundColor;
  result.appendChild(ball);
}

for (let i = 0; i < results.length - 1; i++) {
  (function draw(j) {
    setTimeout(function () {
      console.log(results[j]);
      drawBall(results[j], result);
    }, (j + 1) * 1000);
  })(i);
}

setTimeout(function drawBonus() {
  var bonusDiv = document.querySelector(".bonus");
  drawBall(results[results.length - 1], bonusDiv);
}, 7000);
