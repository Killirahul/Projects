const readline = require('readline');

const SIZE = 5;
const BOMBS = 5;

let board = Array.from({ length: SIZE }, () => Array(SIZE).fill('0'));
let display = Array.from({ length: SIZE }, () => Array(SIZE).fill('*'));

function initBoard() {
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            board[i][j] = '0';
        }
    }
}

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

function showBoard() {
    for (let i = 0; i < SIZE; i++) {
        let row = '';
        for (let j = 0; j < SIZE; j++) {
            row += display[i][j] + ' ';
        }
        console.log(row);
    }
}

function startGame() {
    initBoard();
    placeBombs();
    calculateNumbers();
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            display[i][j] = '*';
        }
    }
    let revealed = 0;
    const totalToReveal = SIZE * SIZE - BOMBS;
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    function ask() {
        showBoard();
        rl.question('Enter x y: ', (answer) => {
            let [x, y] = answer.split(' ').map(Number);
            if (
                isNaN(x) || isNaN(y) ||
                x < 0 || x >= SIZE || y < 0 || y >= SIZE
            ) {
                console.log('Invalid coordinates. Try again.');
                ask();
                return;
            }
            if (display[x][y] !== '*') {
                console.log('Cell already revealed. Try another.');
                ask();
                return;
            }
            if (board[x][y] === 'B') {
                console.log('Boom! Game Over');
                rl.close();
                return;
            } else {
                display[x][y] = board[x][y];
                revealed++;
                if (revealed === totalToReveal) {
                    console.log('Congratulations! You win!');
                    showBoard();
                    rl.close();
                    return;
                }
                ask();
            }
        });
    }
    ask();
}

startGame();
