/***************************************************
 * MOTOR DEL JUEGO – VERSIÓN BASE
 * Nivel 1 | Plantilla 1 | P / I
 * Autor: Proyecto Puzzle Lógico
 ***************************************************/

/* ===============================
   1. CONSTANTES BÁSICAS
================================ */

const EVEN = "P"; // Par
const ODD  = "I"; // Impar

const OPERATIONS = ["ADD", "SUB", "MUL"]; 
// Operación real NO visible para el jugador


/* ===============================
   2. ESTADO GLOBAL DEL JUEGO
================================ */

const GameState = {
  level: 1,
  puzzlesSolved: 0,
  puzzlesPlayed: 0,
  score: 0,
  mistakes: 0,
  timeLimit: 30, // segundos (nivel 1 educativo)
  adsCounter: 0,
  abuseCounter: 0
};


/* ===============================
   3. REGLAS LÓGICAS P / I
================================ */

/*
 Reglas matemáticas por PROPIEDAD:
 P + P = P
 P + I = I
 I + I = P

 P * P = P
 P * I = P
 I * I = I
*/

function resolvePI(a, b, operation) {
  if (operation === "ADD") {
    if (a === b) return EVEN;
    return ODD;
  }

  if (operation === "SUB") {
    if (a === b) return EVEN;
    return ODD;
  }

  if (operation === "MUL") {
    if (a === EVEN || b === EVEN) return EVEN;
    return ODD;
  }

  return null;
}


/* ===============================
   4. GENERADOR DE PLANTILLA 1
   (3x3)
================================ */

function generateTemplate1() {
  const operation = OPERATIONS[Math.floor(Math.random() * OPERATIONS.length)];

  const headersRow = [randomPI(), randomPI()];
  const headersCol = [randomPI(), randomPI()];

  const solutionGrid = [];

  for (let r = 0; r < 2; r++) {
    solutionGrid[r] = [];
    for (let c = 0; c < 2; c++) {
      solutionGrid[r][c] = resolvePI(
        headersRow[c],
        headersCol[r],
        operation
      );
    }
  }

  // Ocultar celdas (dificultad nivel 1)
  const hidden = JSON.parse(JSON.stringify(solutionGrid));
  const hideCount = 2;

  let hiddenPositions = [];

  while (hiddenPositions.length < hideCount) {
    const r = Math.floor(Math.random() * 2);
    const c = Math.floor(Math.random() * 2);
    const key = `${r}-${c}`;
    if (!hiddenPositions.includes(key)) {
      hidden[r][c] = null;
      hiddenPositions.push(key);
    }
  }

  return {
    operation,          // OCULTA AL JUGADOR
    headersRow,
    headersCol,
    solutionGrid,
    playerGrid: hidden
  };
}


/* ===============================
   5. VERIFICADOR DE RESPUESTAS
================================ */

function checkSolution(puzzle, playerInputGrid) {
  let correct = true;

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      if (playerInputGrid[r][c] !== puzzle.solutionGrid[r][c]) {
        correct = false;
      }
    }
  }

  if (correct) {
    GameState.score += 10;
    GameState.puzzlesSolved++;
  } else {
    GameState.mistakes++;
    GameState.score = Math.max(0, GameState.score - 3);
    GameState.abuseCounter++;
  }

  GameState.puzzlesPlayed++;
  GameState.adsCounter++;

  handleAdsLogic();
  detectAbuse();

  return correct;
}


/* ===============================
   6. MONETIZACIÓN (EVENTOS)
================================ */

function handleAdsLogic() {
  if (GameState.adsCounter >= 4) {
    GameState.adsCounter = 0;

    // 🔴 AQUÍ VA EL ANUNCIO INTERSTICIAL
    console.log("📺 Evento: Mostrar anuncio intersticial");
  }
}


/* ===============================
   7. DETECCIÓN DE ABUSO
================================ */

function detectAbuse() {
  if (GameState.abuseCounter >= 3) {
    GameState.score = Math.max(0, GameState.score - 5);

    // 🔴 Monetización defensiva
    console.log("⚠️ Abuso detectado: reducir puntos + acelerar anuncios");

    GameState.abuseCounter = 0;
  }
}


/* ===============================
   8. UTILIDADES
================================ */

function randomPI() {
  return Math.random() < 0.5 ? EVEN : ODD;
}


/* ===============================
   9. API DEL MOTOR
================================ */

const GameEngine = {
  newPuzzle: generateTemplate1,
  checkSolution,
  state: GameState
};


/* ===============================
   10. EXPORT (WEB)
================================ */

// Para uso en index.html
window.GameEngine = GameEngine;
