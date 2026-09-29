let size = 3;
let board = [];
let clicks = 0;
let gameOver = false;

function makeBoard() {
  gameOver = false;
  clicks = 0;
  board = [];
  for (let row = 0; row < size; row++) {
    const row = [];
    for (let column = 0; column < size; column++) {
      row.push(0);
    }
    board.push(row);
  }
}

const boardElement = document.getElementById("board");
const directions = [
  [0, 0],
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
];

function DrawBoard() {
  boardElement.innerHTML = "";
  boardElement.style.gridTemplateColumns = "repeat(" + size + ", 70px)";

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const button = document.createElement("button");
      button.className = "light";
      button.dataset.row = row;
      button.dataset.column = column;

      if (board[row][column] == 1) {
        button.classList.add("on");
      }

      boardElement.appendChild(button);
    }
  }
}

function Switch(row, column) {
  for (const [dRow, dColumn] of directions) {
    const newRow = row + dRow;
    const newColumn = column + dColumn;

    if (newRow < 0 || newRow >= size || newColumn < 0 || newColumn >= size) {
      continue;
    }

    board[newRow][newColumn] = 1 - board[newRow][newColumn];
  }
}

function shuffleBoard() {
  const moves = size * 2;
  for (let i = 0; i < moves; i++) {
    const row = Math.floor(Math.random() * size);
    const column = Math.floor(Math.random() * size);
    Switch(row, column);
  }
}

function isWon() {
  for (let column = 0; column < size; column++) {
    for (let row = 0; row < size; row++) {
      if (board[row][column] == 1) {
        return false;
      }
    }
  }
  return true;
}

const clicksElement = document.getElementById("clicks");
const levelElement = document.getElementById("levels");
const levelNumElement = document.getElementById("level_num");

document.addEventListener("pointermove", (e) => {
  document.documentElement.style.setProperty("--x", e.clientX + "px");
  document.documentElement.style.setProperty("--y", e.clientY + "px");
});

let currentLevel = 1;

function StartGame(newSize, levelNum) {
  size = newSize;
  currentLevel = levelNum;
  levelNumElement.textContent = levelNum;
  document.body.classList.remove("won");
  do {
    makeBoard();
    shuffleBoard();
  } while (isWon());
  DrawBoard();
  clicksElement.textContent = clicks;
}

const winText = document.getElementById("win_text");

boardElement.addEventListener("pointerdown", (e) => {
  if (gameOver) {
    return;
  }
  const button = e.target.closest(".light");
  if (!button) {
    return;
  }
  const row = Number(button.dataset.row);
  const column = Number(button.dataset.column);

  Switch(row, column);
  clicks++;
  clicksElement.textContent = clicks;
  DrawBoard();

  if (isWon()) {
    gameOver = true;
    document.body.classList.add("won");
    document.body.classList.add("no_scroll");
    console.log("Won in " + clicks + " clicks!");
    winText.textContent =
      "level " + currentLevel + " solved in " + clicks + " clicks!!";
    document.getElementById("popup").classList.add("show");
  }
});

levelElement.addEventListener("click", (e) => {
  if (gameOver) {
    return;
  }
  const button = e.target.closest(".level_btn");
  if (!button) {
    return;
  }

  StartGame(Number(button.dataset.size), Number(button.dataset.level));

  document
    .querySelectorAll(".level_btn")
    .forEach((b) => b.classList.remove("active"));
  button.classList.add("active");
});

document.getElementById("next_button").addEventListener("click", () => {
  gameOver = false;
  document.getElementById("popup").classList.remove("show");
  document.body.classList.remove("no_scroll");

  if (currentLevel === 1) {
    StartGame(4, 2);
    document.getElementById("level1").classList.remove("active");
    document.getElementById("level2").classList.add("active");
  } else if (currentLevel == 2) {
    StartGame(5, 3);
    document.getElementById("level2").classList.remove("active");
    document.getElementById("level3").classList.add("active");
  }
});

document
  .getElementById("reset_btn")
  .addEventListener("click", () => StartGame(size, currentLevel));

document.getElementById("on_off_light").addEventListener("click", () => {
  document.body.classList.toggle("invert");
});

document.getElementById("on_off_light2").addEventListener("click", () => {
  document.body.classList.toggle("invert");
});

StartGame(3, 1);
console.log(board);
