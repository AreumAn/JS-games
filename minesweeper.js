let tbody = document.querySelector("#table tbody");
let resultDiv = document.querySelector("#result");
let timer = document.querySelector("#timer");

/**
 * dataSet
 *
 * 0: default - not opened, no bomb
 * 1: opned
 * X: bomb
 */
let dataSet = [];
let isStopGame = false;
let openedGrid = 0;
const messages = {
  lose: "You Lose!",
  win: "You Win!",
  timeout: "Timeout! You Lose!",
};

// Get bombs random indx
function getBombs(row, column, bomb) {
  // get all possible idx
  let allIdx = Array(row * column)
    .fill()
    .map((el, idx) => {
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
  resultDiv.textContent = "";
  dataSet = [];
  isStopGame = false;
  openedGrid = 0;
}

// Get dataSet values around dataSet[row][col]
function getAroundDataValue(row, col) {
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
  return aroundArr;
}

//Get td elements around tbody.children[row].children[col] which the user clicked
function getAroundGrid(row, col) {
  let aroundTDArr = [
    tbody.children[row].children[col - 1],
    tbody.children[row].children[col + 1],
  ];
  if (tbody.children[row - 1]) {
    aroundTDArr = aroundTDArr.concat(
      tbody.children[row - 1].children[col - 1],
      tbody.children[row - 1].children[col],
      tbody.children[row - 1].children[col + 1]
    );
  }
  if (tbody.children[row + 1]) {
    aroundTDArr = aroundTDArr.concat(
      tbody.children[row + 1].children[col - 1],
      tbody.children[row + 1].children[col],
      tbody.children[row + 1].children[col + 1]
    );
  }

  return aroundTDArr;
}

// Get how many bombs are around
function getBombsNum(row, col) {
  return getAroundDataValue(row, col).filter((v) => {
    return v === "X";
  }).length;
}

// Open girds around when it doesn't have bombs
function openAroundGrid(row, col) {
  getAroundGrid(row, col)
    .filter((v) => !!v && !v.classList.contains("opened")) // filter undefined
    .forEach((td) => {
      setTimeout(() => {
        td.click();
      }, 10);
    });
}

// Draw flag or question on the grid
function drawFlag(target) {
  if (target.textContent === "!") {
    target.textContent = "?";
    target.classList.remove("flag");
    target.classList.add("question");
  } else if (target.textContent === "?") {
    target.classList.remove("question");
    target.textContent = "";
  } else {
    target.classList.add("flag");
    target.textContent = "!";
  }
}

// Decrease time
let interval;
function decreaseTime(time) {
  interval = setInterval(() => {
    if (time < 0 || isStopGame) {
      showResult(messages.timeout);
      clearInterval(interval);
      return;
    }
    timer.textContent = time;
    time -= 1;
  }, 1000);
}

// show bombs and result msg when game is done
function showResult(text) {
  isStopGame = true;
  resultDiv.textContent = text;
  clearInterval(interval);
  console.log(dataSet.length);
  for (let i = 0; i < dataSet.length; i++) {
    for (let j = 0; j < dataSet[i].length; j++) {
      if (dataSet[i][j] === "X") {
        let tr = tbody.children[i].children[j];
        tr.textContent = "X";
        tr.classList.add("bombs");
      }
    }
  }
}

document.querySelector("#exec").addEventListener("click", (e) => {
  resetGame();

  const row = document.querySelector("#hor").value;
  const column = document.querySelector("#ver").value;
  const bomb = document.querySelector("#bomb").value;
  let bombsIdx = getBombs(row, column, bomb);
  let pressKeys = {
    right: false,
    left: false,
  };

  // Draw table
  for (let i = 0; i < row; i++) {
    let arr = [];
    let tr = document.createElement("tr");
    dataSet.push(arr);
    for (let j = 0; j < column; j++) {
      arr.push(0);
      let td = document.createElement("td");

      td.addEventListener("mousedown", (e) => {
        if (e.which == 1) {
          pressKeys.left = true;
        } else if (e.which === 3) {
          pressKeys.right = true;
        }

        // Click right, left button at the same time
        if (pressKeys.right && pressKeys.left) {
          pressKeys.right = false;
          if (dataSet[i][j] === 1) {
            // check if bomb has X but it has not flag or question, change color
            let array = getAroundGrid(i, j);
            let values = getAroundDataValue(i, j);
            let matched = [];
            let temp = [];

            for (let i = 0; i < array.length; i++) {
              if (
                values[i] === "X" &&
                !!array[i].textContent &&
                array[i].textContent !== "X"
              ) {
                matched.push(array[i]);
              } else if (values[i] !== 1) {
                temp.push(array[i]);
              }
            }

            if (matched.length === getBombsNum(i, j)) {
              temp
                .filter((v) => !!v)
                .forEach((td) => {
                  td.click();
                });
            } else {
              temp
                .filter((v) => !!v)
                .forEach((td) => {
                  td.classList.add("hoverAnimation");
                });
            }
          }
        }
      });
      td.addEventListener("mouseup", (e) => {
        if (e.which == 1) {
          pressKeys.left = false;
        } else if (e.which === 3) {
          pressKeys.right = false;
        }
        let hoveredEls = document.querySelectorAll(".hoverAnimation");
        for (let i = 0; i < hoveredEls.length; i++) {
          hoveredEls[i].classList.remove("hoverAnimation");
        }
      });
      // Right click event for adding flag
      td.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (isStopGame || dataSet[i][j] === 1) {
          // return if game is done or this grid is already opened
          return;
        }
        if (!pressKeys.left) {
          drawFlag(e.target);
        }
        pressKeys.right = false;
      });
      // left click to get number of bombs
      td.addEventListener("click", (e) => {
        if (isStopGame) {
          return;
        }

        if (dataSet[i][j] === "X") {
          // If user clicks bomb, user will lose.
          showResult(messages.lose);
        } else if (dataSet[i][j] !== 1) {
          // Show bombs number around clicked grid
          let bombsAroundTarget = getBombsNum(i, j);
          dataSet[i][j] = 1;
          openedGrid += 1;
          // If bombsAroundTarget is falsy - false, '', 0, null, undefined, NaN -
          // Use "" instead
          e.target.textContent = bombsAroundTarget || "";
          e.target.classList.add("opened");
          // If target doesn't have bomb around, open around grid
          if (bombsAroundTarget === 0) {
            openAroundGrid(i, j);
          }
        }

        if (openedGrid >= row * column - bomb) {
          showResult(messages.win);
        }
      });
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  // Add bombs
  for (let i = 0; i < bombsIdx.length; i++) {
    let rowPosition = Math.floor(bombsIdx[i] / column);
    let colPosition = bombsIdx[i] % column;
    dataSet[rowPosition][colPosition] = "X";
  }

  // Set timer
  let time = (timer.textContent = 5);
  decreaseTime(time, bombsIdx);
});
