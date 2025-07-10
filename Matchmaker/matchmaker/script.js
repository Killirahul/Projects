const board = document.getElementById('gameBoard');
const timerLabel = document.getElementById('timer');
const statusLabel = document.getElementById('status');

const rows = 4;
const cols = 6;
const total = rows * cols;
const timeLimit = 60;

let symbols = [];
let cards = [];
let revealed = [];
let matched = 0;
let timeLeft = timeLimit;
let timer;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function initGame() {
  const letters = [];
  for (let i = 0; i < total / 2; i++) {
    const char = String.fromCharCode(65 + i); // A, B, C, ...
    letters.push(char, char);
  }
  shuffle(letters);
  symbols = letters;

  board.innerHTML = '';
  cards = [];

  for (let i = 0; i < total; i++) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = i;
    card.textContent = '?';
    card.addEventListener('click', handleCardClick);
    cards.push(card);
    board.appendChild(card);
  }

  timeLeft = timeLimit;
  timerLabel.textContent = `⏳ Time Left: ${timeLeft}`;
  statusLabel.textContent = '';
  matched = 0;

  timer = setInterval(updateTimer, 1000);
}

function handleCardClick(e) {
  const index = e.target.dataset.index;
  if (cards[index].classList.contains('matched') ||
      cards[index].classList.contains('revealed') ||
      revealed.length === 2) return;

  revealCard(index);

  revealed.push(index);

  if (revealed.length === 2) {
    const [i1, i2] = revealed;
    if (symbols[i1] === symbols[i2]) {
      cards[i1].classList.add('matched');
      cards[i2].classList.add('matched');
      matched += 2;
      revealed = [];

      if (matched === total) {
        clearInterval(timer);
        statusLabel.textContent = "🎉 You Won!";
      }
    } else {
      setTimeout(() => {
        hideCard(i1);
        hideCard(i2);
        revealed = [];
      }, 700);
    }
  }
}

function revealCard(index) {
  cards[index].classList.add('revealed');
  cards[index].textContent = symbols[index];
}

function hideCard(index) {
  cards[index].classList.remove('revealed');
  cards[index].textContent = '?';
}

function updateTimer() {
  timeLeft--;
  timerLabel.textContent = `⏳ Time Left: ${timeLeft}`;
  if (timeLeft <= 0) {
    clearInterval(timer);
    endGame(false);
  }
}

function endGame(won) {
  cards.forEach(card => card.removeEventListener('click', handleCardClick));
  statusLabel.textContent = won ? "🎉 You Won!" : "😢 You Lost! Time's up.";
}

initGame();
