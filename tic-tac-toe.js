const body = document.body;

let table = document.createElement("table");
let tableArr = [];
// player: X or O
let turn = "X";

// winning case
const winningArr = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Change player
function changeTurn() {
  turn === "X" ? (turn = "O") : (turn = "X");
}

// Get element text by id
function getTextContent(id) {
  return document.getElementById(id).textContent;
}

// Check if player wins
function checkWinner(clickedID) {
  for (let i = 0; i < winningArr.length; i++) {
    if (winningArr[i].indexOf(clickedID) !== -1) {
      const a = getTextContent(winningArr[i][0]);
      const b = getTextContent(winningArr[i][1]);
      const c = getTextContent(winningArr[i][2]);

      if (turn === a && turn === b && turn === c) {
        return true;
      }
    }
  }
  return false;
}

// When player clicks grid.
const clickEvent = (event) => {
  const clickedBox = event.target;

  if (clickedBox.textContent !== "") {
    // If other grid is already checked
    alert("You can not click this.");
    return;
  } else if (turn === "X") {
    clickedBox.textContent = "X";
  } else {
    clickedBox.textContent = "O";
  }

  // Check if player wins
  if (checkWinner(parseInt(clickedBox.id))) {
    const title = document.getElementById("title");
    let winnerText = document.createElement("h2");
    winnerText.style.color = "red";
    winnerText.textContent =
      turn + " WIN!! This page will be reload in 5 sec. ";
    title.after(winnerText);
    setTimeout(() => {
      location.reload();
    }, 5000);
  } else {
    // Change turn to other player
    changeTurn();
  }
};

// Draw grid with id
for (let i = 0; i < 3; i++) {
  let row = document.createElement("tr");
  for (let j = 0; j < 3; j++) {
    let col = document.createElement("td");
    col.id = tableArr.length;
    col.addEventListener("click", clickEvent);
    tableArr.push(tableArr.length);
    row.appendChild(col);
  }
  table.appendChild(row);
}

body.appendChild(table);
