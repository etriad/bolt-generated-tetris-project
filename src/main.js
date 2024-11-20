import { Arena } from './arena.js';
import { Player } from './player.js';
import { randomTetromino } from './tetrominos.js';
import { SoundManager } from './sounds.js';

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const gameOverElement = document.getElementById('game-over');
const playAgainButton = document.getElementById('play-again');
const soundManager = new SoundManager();

canvas.width = 240;
canvas.height = 400;
context.scale(20, 20);

let arena = new Arena(12, 20);
let player = new Player();
let highScore = parseInt(localStorage.getItem('tetrisHighScore')) || 0;
let gameRunning = true;
let animationId = null;

updateHighScore();

arena.onMerge = () => {
  soundManager.createSquishSound();
};

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function updateScore() {
  scoreElement.textContent = `Score: ${player.score}`;
}

function updateHighScore() {
  highScoreElement.textContent = `Best: ${highScore}`;
}

function createGradient(color1, color2, x, y) {
  const gradient = context.createLinearGradient(x, y, x + 1, y + 1);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
}

function drawBlock(x, y, colors) {
  const blockSize = 1;
  const radius = 0.15;

  context.fillStyle = createGradient(colors[0], colors[1], x, y);
  context.beginPath();
  context.roundRect(x, y, blockSize, blockSize, radius);
  context.fill();

  context.fillStyle = 'rgba(255, 255, 255, 0.3)';
  context.beginPath();
  context.roundRect(x + 0.1, y + 0.1, blockSize - 0.2, blockSize - 0.2, radius);
  context.fill();

  context.fillStyle = 'rgba(255, 255, 255, 0.5)';
  context.beginPath();
  context.ellipse(
    x + 0.3,
    y + 0.3,
    0.1,
    0.1,
    0,
    0,
    Math.PI * 2
  );
  context.fill();
}

function draw() {
  context.fillStyle = '#FFE4E1';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = 'rgba(255, 182, 193, 0.2)';
  context.lineWidth = 0.02;
  for (let i = 0; i <= arena.matrix[0].length; i++) {
    context.beginPath();
    context.moveTo(i, 0);
    context.lineTo(i, arena.matrix.length);
    context.stroke();
  }
  for (let i = 0; i <= arena.matrix.length; i++) {
    context.beginPath();
    context.moveTo(0, i);
    context.lineTo(arena.matrix[0].length, i);
    context.stroke();
  }

  arena.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== null) {
        drawBlock(x, y, value.gradient);
      }
    });
  });

  player.tetromino.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        drawBlock(
          x + player.pos.x,
          y + player.pos.y,
          player.tetromino.gradient
        );
      }
    });
  });
}

function gameOver() {
  gameRunning = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  gameOverElement.style.display = 'block';
  if (player.score > highScore) {
    highScore = player.score;
    localStorage.setItem('tetrisHighScore', highScore);
    updateHighScore();
  }
}

function resetGame() {
  arena = new Arena(12, 20);
  player = new Player();
  gameRunning = true;
  dropCounter = 0;
  lastTime = 0;
  gameOverElement.style.display = 'none';
  
  // Reset score
  player.score = 0;
  updateScore();
  
  // Set up merge callback for new arena
  arena.onMerge = () => {
    soundManager.createSquishSound();
  };
  
  // Start new piece
  playerReset();
  
  // Restart animation loop
  if (!animationId) {
    animationId = requestAnimationFrame(update);
  }
}

function playerDrop() {
  player.pos.y++;
  if (arena.collide(player)) {
    player.pos.y--;
    arena.merge(player);
    playerReset();
    const rowCount = arena.sweep();
    if (rowCount > 0) {
      player.score += rowCount * 100;
      soundManager.createClearSound();
      updateScore();
    }
  }
  dropCounter = 0;
}

function playerMove(dir) {
  player.pos.x += dir;
  if (arena.collide(player)) {
    player.pos.x -= dir;
  } else {
    soundManager.createPopSound();
  }
}

function playerReset() {
  player.reset(randomTetromino());
  if (arena.collide(player)) {
    gameOver();
  }
}

function playerRotate() {
  const pos = player.pos.x;
  let offset = 1;
  player.rotate(1);
  while (arena.collide(player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.tetromino.matrix[0].length) {
      player.rotate(-1);
      player.pos.x = pos;
      return;
    }
  }
  soundManager.createPopSound();
}

function update(time = 0) {
  if (!gameRunning) return;

  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  animationId = requestAnimationFrame(update);
}

playAgainButton.addEventListener('click', () => {
  resetGame();
});

document.addEventListener('click', () => {
  if (soundManager.audioContext.state === 'suspended') {
    soundManager.audioContext.resume();
  }
}, { once: true });

document.addEventListener('keydown', event => {
  if (!gameRunning) return;
  
  if (event.key === 'ArrowLeft') {
    playerMove(-1);
  } else if (event.key === 'ArrowRight') {
    playerMove(1);
  } else if (event.key === 'ArrowDown') {
    playerDrop();
  } else if (event.key === 'ArrowUp') {
    playerRotate();
  } else if (event.key === ' ') {
    while (!arena.collide(player) && gameRunning) {
      player.pos.y++;
    }
    player.pos.y--;
    arena.merge(player);
    playerReset();
    arena.sweep();
  }
});

playerReset();
update();
