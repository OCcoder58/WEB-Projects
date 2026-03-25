// Karten mit Paaren
let cards = ["🍎", "🍎", "🍌", "🍌", "🍇", "🍇", "🍓", "🍓"];

// Spielzustand
let flippedCards = [];
let matchedPairs = 0;
let lockBoard = false;

const gameBoard = document.getElementById("game-board");
const message = document.getElementById("message");
const resetButton = document.getElementById("reset-btn");

// Karten mischen
function shuffleCards(array) {
  array.sort(function () {
    return Math.random() - 0.5;
  });
}

// Karten ins HTML setzen
function renderCards() {
  gameBoard.innerHTML = "";

  for (let i = 0; i < cards.length; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.textContent = "?";
    card.cardIndex = i;

    card.addEventListener("click", function () {
      flipCard(card);
    });

    gameBoard.appendChild(card);
  }
}

// Karte umdrehen
function flipCard(card) {
  if (lockBoard) return;
  if (card.classList.contains("flipped")) return;
  if (card.classList.contains("matched")) return;
  if (flippedCards.length === 2) return;

  let index = card.cardIndex;

  card.textContent = cards[index];
  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

// Prüfen ob 2 Karten gleich sind
function checkMatch() {
  lockBoard = true;

  let firstCard = flippedCards[0];
  let secondCard = flippedCards[1];

  let firstIndex = firstCard.cardIndex;
  let secondIndex = secondCard.cardIndex;

  if (cards[firstIndex] === cards[secondIndex]) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matchedPairs++;
    flippedCards = [];
    lockBoard = false;

    if (matchedPairs === cards.length / 2) {
      message.textContent = "You won! All pairs matched.";
    }
  } else {
    setTimeout(function () {
      firstCard.textContent = "?";
      secondCard.textContent = "?";
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");

      flippedCards = [];
      lockBoard = false;
    }, 800);
  }
}

// Spiel zurücksetzen
function resetGame() {
  flippedCards = [];
  matchedPairs = 0;
  lockBoard = false;
  message.textContent = "";

  shuffleCards(cards);
  renderCards();
}

resetButton.addEventListener("click", resetGame);

resetGame();
