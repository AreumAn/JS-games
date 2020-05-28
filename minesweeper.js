let tbody = document.querySelector("#table tbody");
let dataSet = [];

// Get bombs random indx
function getBombs(row, column, bomb) {
  // get all possible idx
  let allIdx = Array(row * column)
    .fill()
    .map(function (el, idx) {
      return idx;
    });

  let shuffle = [];

  // Get random idx array to add bomb
  while (allIdx.length > row * column - bomb) {
    let idx = allIdx.splice(Math.floor(Math.random() * allIdx.length), 1)[0];
    shuffle.push(idx);
  }

  return shuffle;
}

function resetGame() {
  tbody.innerHTML = "";
  dataSet = [];
}

// Get how many bombs are around
function getBombsNum(row, col) {
  let aroundArr = [dataSet[row][col - 1], dataSet[row][col + 1]];
  if (dataSet[row - 1]) {
    aroundArr = aroundArr.concat(
      dataSet[row - 1][col - 1],
      dataSet[row - 1][col],
      dataSet[row - 1][col + 1]
    );
  }
  if (dataSet[row + 1]) {
    aroundArr = aroundArr.concat(
      dataSet[row + 1][col - 1],
      dataSet[row + 1][col],
      dataSet[row + 1][col + 1]
    );
  }
  return aroundArr.filter((v) => {
    return v === "X";
  }).length;
}

document.querySelector("#exec").addEventListener("click", (e) => {
  resetGame();

  const row = document.querySelector("#hor").value;
  const column = document.querySelector("#ver").value;
  const bomb = document.querySelector("#bomb").value;

  console.log(row, column, bomb);

  // Draw table
  for (let i = 0; i < row; i++) {
    let arr = [];
    let tr = document.createElement("tr");
    dataSet.push(arr);
    for (let j = 0; j < column; j++) {
      arr.push(1);
      let td = document.createElement("td");
      // Right click event for adding flag
      td.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (e.target.textContent === "!") {
          e.target.textContent = "?";
          dataSet[i][j] = "?";
        } else if (e.target.textContent === "?") {
          e.target.textContent = "";
          dataSet[i][j] = dataSet[i][j] === "X" ? "X" : 1;
        } else {
          e.target.textContent = "!";
          dataSet[i][j] = "!";
        }
      });
      // left click to get number of bombs
      td.addEventListener("click", (e) => {
        if (dataSet[i][j] === "X") {
          // If user clicks bomb, user will lose.
          console.log("You lose!");
        } else {
          // Show bombs number around clicked grid
          e.target.textContent = getBombsNum(i, j);
        }
      });
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  let bombsIdx = getBombs(row, column, bomb);
  console.log("bombsIdx :", bombsIdx);

  // Add bombs
  for (let i = 0; i < bombsIdx.length; i++) {
    let rowPosition = Math.floor(bombsIdx[i] / 10);
    let colPosition = bombsIdx[i] % 10;
    tbody.children[rowPosition].children[colPosition].textContent = "X";
    dataSet[rowPosition][colPosition] = "X";
  }

  console.log(dataSet);
});
