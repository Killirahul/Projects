const SIZE = 5;
const BOMBS = 5;
let board = Array.from({ length: SIZE }, () => Array(SIZE).fill('0'));
let revealed = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
let cellsRevealed = 0;
let gameOver = false;

function placeBombs() {
    let count = 0;
    while (count < BOMBS) {
        let x = Math.floor(Math.random() * SIZE);
        let y = Math.floor(Math.random() * SIZE);
        if (board[x][y] !== 'B') {
            board[x][y] = 'B';
            count++;
        }
    }
}

const dx = [-1, -1, -1, 0, 0, 1, 1, 1];
const dy = [-1, 0, 1, -1, 1, -1, 0, 1];

function countAdjacentBombs(x, y) {
    let count = 0;
    for (let d = 0; d < 8; d++) {
        let nx = x + dx[d];
        let ny = y + dy[d];
        if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && board[nx][ny] === 'B') {
            count++;
        }
    }
    return count;
}

function calculateNumbers() {
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (board[i][j] !== 'B') {
                board[i][j] = countAdjacentBombs(i, j).toString();
            }
        }
    }
}

function revealCell(x, y) {
    if (gameOver || revealed[x][y]) return;
    revealed[x][y] = true;
    const cell = document.getElementById(`cell-${x}-${y}`);
    cell.classList.add('revealed');
    if (board[x][y] === 'B') {
        cell.textContent = '💣';
        cell.classList.add('bomb');
        document.getElementById('message').innerHTML = '<span class="lose">Boom! Game Over</span>';
        gameOver = true;
        revealAllBombs();
        return;
    } else {
        cell.textContent = board[x][y] === '0' ? '' : board[x][y];
        cellsRevealed++;
        if (cellsRevealed === SIZE * SIZE - BOMBS) {
            document.getElementById('message').innerHTML = '<span class="win">Congratulations! You win!</span>';
            gameOver = true;
        }
    }
}

function revealAllBombs() {
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (board[i][j] === 'B') {
                const cell = document.getElementById(`cell-${i}-${j}`);
                cell.textContent = '💣';
                cell.classList.add('bomb', 'revealed');
            }
        }
    }
}

function createBoard() {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = '';
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${i}-${j}`;
            cell.addEventListener('click', () => revealCell(i, j));
            boardDiv.appendChild(cell);
        }
    }
}

function startGame() {
    board = Array.from({ length: SIZE }, () => Array(SIZE).fill('0'));
    revealed = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
    cellsRevealed = 0;
    gameOver = false;
    document.getElementById('message').textContent = '';
    placeBombs();
    calculateNumbers();
    createBoard();
}

document.addEventListener('DOMContentLoaded', startGame);
