let tbody = document.querySelector("#table tbody");
let resultDiv = document.querySelector("#result");
let timer = document.querySelector("#timer");

let isStopGame = false;
let openedGrid = 0;
let dataSet = [];

// To save dataSet
const dataCode = {
  default: 0,
  opened: 1,
  bomb: "X",
  flag: "!",
  question: "?",
};

// To show msg to user
const messages = {
  lose: "You Lose!",
  win: "You Win!",
  timeout: "Timeout! You Lose!",
};

// To add/remove class for style
const classCode = {
  opened: "opened",
  flag: "flag",
  question: "question",
  bombs: "bombs",
  hoverAnimation: "hoverAnimation",
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

// Get dataSet values surrounding dataSet[row][col]
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

//Get td elements surrounding tbody.children[row].children[col] which the user clicked
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

// Get surrounding bombs
function getBombsNum(row, col) {
  return getAroundDataValue(row, col).filter((v) => {
    return v === dataCode.bomb;
  }).length;
}

// Open surrounding girds when it doesn't have bombs
function openAroundGrid(row, col) {
  getAroundGrid(row, col)
    .filter((v) => !!v && !v.classList.contains(classCode.opened)) // filter undefined
    .forEach((td) => {
      setTimeout(() => {
        td.click();
      }, 10);
    });
}

// Draw flag or question on the grid
function drawFlag(target) {
  if (target.textContent === dataCode.flag) {
    target.textContent = dataCode.question;
    target.classList.remove(classCode.flag);
    target.classList.add(classCode.question);
  } else if (target.textContent === dataCode.question) {
    target.classList.remove(classCode.question);
    target.textContent = "";
  } else {
    target.classList.add(classCode.flag);
    target.textContent = dataCode.flag;
  }
}

// Decrease time
let interval;
function decreaseTime(time) {
  interval = setInterval(() => {
    if (time < 0 || isStopGame) {
      stopGame(messages.timeout);
      return;
    }
    timer.textContent = time;
    time -= 1;
  }, 1000);
}

// Stop game, show bombs and result msg when game is done
function stopGame(text) {
  isStopGame = true;
  // Stop timer
  clearInterval(interval);
  // Show result
  resultDiv.textContent = text;
  // Show bombs
  for (let i = 0; i < dataSet.length; i++) {
    for (let j = 0; j < dataSet[i].length; j++) {
      if (dataSet[i][j] === dataCode.bomb) {
        let tr = tbody.children[i].children[j];
        tr.textContent = dataCode.bomb;
        tr.classList.add(classCode.bombs);
      }
    }
  }
}

// Restart game
function resetGame() {
  tbody.innerHTML = "";
  resultDiv.textContent = "";
  dataSet = [];
  isStopGame = false;
  openedGrid = 0;
  clearInterval(interval);
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
    let defaultDataSet = [];
    let tr = document.createElement("tr");
    dataSet.push(defaultDataSet);
    for (let j = 0; j < column; j++) {
      defaultDataSet.push(dataCode.default);
      let td = document.createElement("td");

      td.addEventListener("mousedown", (e) => {
        if (e.which == 1) {
          pressKeys.left = true;
        } else if (e.which === 3) {
          pressKeys.right = true;
        }

        // Click both right, left buttons at the same time
        if (pressKeys.right && pressKeys.left) {
          pressKeys.right = false;

          if (dataSet[i][j] === dataCode.opened) {
            // check if bomb exists but it has not flag or question, blink surrounding grids
            let aroundGrids = getAroundGrid(i, j);
            let aroundGridsValues = getAroundDataValue(i, j);

            let foundedBombs = [];
            let unopnedGrids = [];

            for (let i = 0; i < aroundGrids.length; i++) {
              if (
                aroundGridsValues[i] === dataCode.bomb &&
                !!aroundGrids[i].textContent
              ) {
                // The user already found bombs with flag or question
                foundedBombs.push(aroundGrids[i]);
              } else if (aroundGridsValues[i] !== dataCode.opened) {
                // grid is not opened
                unopnedGrids.push(aroundGrids[i]);
              }
            }

            if (foundedBombs.length === getBombsNum(i, j)) {
              // if the user already found surrounding bombs grids, open other grids
              unopnedGrids
                .filter((v) => !!v)
                .forEach((td) => {
                  td.click();
                });
            } else {
              // if the user don't find surrounding bombs, blink grids
              unopnedGrids
                .filter((v) => !!v)
                .forEach((td) => {
                  td.classList.add(classCode.hoverAnimation);
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
        // Remove blink style
        let hoveredEls = document.querySelectorAll(".hoverAnimation");
        for (let i = 0; i < hoveredEls.length; i++) {
          hoveredEls[i].classList.remove(classCode.hoverAnimation);
        }
      });

      // Right click event for adding flag
      td.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (isStopGame || dataSet[i][j] === dataCode.opened) {
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

        if (dataSet[i][j] === dataCode.bomb) {
          // If user clicks bomb, user will lose.
          stopGame(messages.lose);
        } else if (dataSet[i][j] !== dataCode.opened) {
          // Show bombs number around clicked grid
          let bombsAroundTarget = getBombsNum(i, j);
          dataSet[i][j] = dataCode.opened;
          openedGrid += 1;
          // If bombsAroundTarget is falsy - false, '', 0, null, undefined, NaN -
          // Use "" instead
          e.target.textContent = bombsAroundTarget || "";
          e.target.classList.add(classCode.opened);
          // If target doesn't have surrounding bombs, open surrounding grids
          if (bombsAroundTarget === 0) {
            openAroundGrid(i, j);
          }
        }

        if (openedGrid >= row * column - bomb) {
          stopGame(messages.win);
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
    dataSet[rowPosition][colPosition] = dataCode.bomb;
  }

  // Set timer
  let time = (timer.textContent = 100);
  decreaseTime(time, bombsIdx);
});
