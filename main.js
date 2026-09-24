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

function StartGame(newSize) {
  size = newSize;
  do {
    makeBoard();
    shuffleBoard();
  } while (isWon());
  DrawBoard();
  clicksElement.textContent = clicks;
}

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
    console.log("Won in " + clicks + " clicks!");
  }
});

levelElement.addEventListener("click", (e) => {
  const button = e.target.closest(".level_btn");
  if (!button) {
    return;
  }

  StartGame(Number(button.dataset.size));

  document
    .querySelectorAll(".level_btn")
    .forEach((b) => b.classList.remove("active"));
  button.classList.add("active");
});

document
  .getElementById("reset_btn")
  .addEventListener("click", () => StartGame(size));

StartGame(3);
console.log(board);
