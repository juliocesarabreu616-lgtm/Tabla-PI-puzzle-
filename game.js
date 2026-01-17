/*********************************
 * VARIABLES GLOBALES
 *********************************/

// Puntaje y tiempo
let score = 0;
let timeLeft = 30;
let timerInterval = null;

// Estado del puzzle
let currentCorrectAnswer = null;

// ===============================
// B-LITE (DIFICULTAD ADAPTATIVA)
// ===============================
let difficulty = 1;        // 1 = muy fácil
let correctStreak = 0;     // aciertos seguidos
let wrongStreak = 0;       // errores seguidos

const MAX_DIFFICULTY = 5;
const MIN_DIFFICULTY = 1;

// Contador para anuncios defensivos
let puzzlesPlayed = 0;

/*********************************
 * INICIO DEL JUEGO
 *********************************/

startGame();

/*********************************
 * FUNCIONES PRINCIPALES
 *********************************/

function startGame() {
  score = 0;
  updateScore();
  startTimer();
  generatePuzzle();
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 30;
  updateTimer();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      handleTimeOut();
    }
  }, 1000);
}

function handleTimeOut() {
  wrongStreak++;
  correctStreak = 0;

  score = Math.max(0, score - 2);
  updateScore();

  adjustDifficulty();
  maybeShowAd();

  startTimer();
  generatePuzzle();
}

/*********************************
 * PUZZLES (PLANTILLA 1)
 *********************************/

function generatePuzzle() {
  puzzlesPlayed++;

  // Valores base
  let a = randomValue();
  let b = randomValue();

  // Operación oculta
  let operation = randomOperation();

  if (operation === "+") {
    currentCorrectAnswer = a + b;
  } else {
    currentCorrectAnswer = a * b;
  }

  // Mostrar al jugador (sin decir la operación)
  document.getElementById("cellA").innerText = a;
  document.getElementById("cellB").innerText = b;
  document.getElementById("cellResult").innerText = "?";
}

/*********************************
 * RESPUESTA DEL JUGADOR
 *********************************/

function submitAnswer(value) {
  if (value === currentCorrectAnswer) {
    handleCorrect();
  } else {
    handleWrong();
  }

  adjustDifficulty();
  maybeShowAd();

  startTimer();
  generatePuzzle();
}

function handleCorrect() {
  correctStreak++;
  wrongStreak = 0;

  score += 10;
  updateScore();
}

function handleWrong() {
  wrongStreak++;
  correctStreak = 0;

  score = Math.max(0, score - 3);
  updateScore();
}

/*********************************
 * B-LITE: AJUSTE DE DIFICULTAD
 *********************************/

function adjustDifficulty() {
  if (correctStreak >= 3 && difficulty < MAX_DIFFICULTY) {
    difficulty++;
    correctStreak = 0;
  }

  if (wrongStreak >= 2 && difficulty > MIN_DIFFICULTY) {
    difficulty--;
    wrongStreak = 0;
  }
}

/*********************************
 * UTILIDADES
 *********************************/

function randomValue() {
  // La dificultad influye en el rango
  let max = 5 + difficulty * 3;
  return Math.floor(Math.random() * max) + 1;
}

function randomOperation() {
  // Nivel 1–2: más sumas
  if (difficulty <= 2) {
    return Math.random() < 0.7 ? "+" : "*";
  }
  // Nivel 3+: balanceado
  return Math.random() < 0.5 ? "+" : "*";
}

/*********************************
 * UI
 *********************************/

function updateScore() {
  document.getElementById("score").innerText = score;
}

function updateTimer() {
  document.getElementById("timer").innerText = timeLeft;
}

/*********************************
 * MONETIZACIÓN DEFENSIVA
 *********************************/

function maybeShowAd() {
  if (puzzlesPlayed % 4 === 0 || puzzlesPlayed % 5 === 0) {
    showAd();
  }
}

function showAd() {
  console.log("AQUÍ VA EL CÓDIGO DEL ANUNCIO");

  /*
    🔴 AQUÍ ES DONDE TÚ PEGARÁS:
    - Unity Ads
    - AdSense
    - Cualquier SDK

    EJEMPLO:
    unityAds.show();
  */
}
