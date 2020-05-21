const body = document.body;
let questionNumbers;

// Get random number
function randomNumber() {
  questionNumbers = [];

  while (questionNumbers.length < 4) {
    let num = Math.floor(Math.random() * 9 + 1);
    if (questionNumbers.indexOf(num) === -1) {
      questionNumbers.push(num);
    }
  }
}

randomNumber();

// Show result
let result = document.getElementById("result");

let form = document.getElementById("gameForm");

// Input answer
var inputbox = document.getElementById("answerInput");

let btn = document.getElementsByTagName("button");

var opportunities = 0;
form.addEventListener("submit", function (event) {
  event.preventDefault();
  // input answer
  var answer = inputbox.value;

  // correct answer
  if (answer === questionNumbers.join("")) {
    result.textContent =
      "Win! The secret number is " + questionNumbers.join("");
    inputbox.value = "";
    inputbox.focus();
    randomNumber();
    opportunities = 0;
  } else {
    // incorrect answer

    var answerArr = answer.split("");
    // same number, same position
    var bulls = 0;
    // same number, different position
    var cows = 0;
    opportunities += 1;

    if (opportunities > 10) {
      // If user puts incorrect answer over 10 times
      result.textContent =
        "You tried over 10 times! The correct number was" +
        questionNumbers.join("") +
        ".";
      inputbox.value = "";
      inputbox.focus();
      randomNumber();
      opportunities = 0;
    } else {
      for (var i = 0; i <= 3; i += 1) {
        if (Number(answerArr[i]) === questionNumbers[i]) {
          //Check same position and number
          bulls += 1;
        } else if (questionNumbers.indexOf(Number(answerArr[i])) > -1) {
          // different position but existed number
          cows += 1;
        }
      }
      result.textContent = bulls + "Bulls and " + cows + " Cows.";
      inputbox.value = "";
      inputbox.focus();
    }
  }
});
