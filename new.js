const gameArea = document.getElementById("game-area");
const scoreEl = document.getElementById("score");
const missesEl = document.getElementById("misses");
const reactionEl = document.getElementById("reaction");
const highScoreEl = document.getElementById("highscore");
const startBtn = document.getElementById("start-btn");
const soundToggle = document.getElementById("sound-toggle");
const difficultySelect = document.getElementById("difficulty");
const popSound = document.getElementById("pop-sound");

let score = 0, misses = 0, bubblesLeft = 10;
let totalBubbles = 10;
let appearTime, timer;
let soundOn = true;

const difficulties = {
  easy: 2500,
  medium: 1800,
  hard: 1200
};

function randomPosition() {
  const x = Math.random() * (gameArea.clientWidth - 60);
  const y = Math.random() * (gameArea.clientHeight - 60);
  return { x, y };
}

function getRandomColor() {
  const colors = ['var(--bubble)', 'var(--bubble2)', 'var(--bubble3)'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function spawnBubble() {
  if (bubblesLeft <= 0) return endGame();

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.style.background = getRandomColor();
  const { x, y } = randomPosition();
  bubble.style.left = `${x}px`;
  bubble.style.top = `${y}px`;

  appearTime = Date.now();

  bubble.addEventListener("click", () => {
    const reaction = (Date.now() - appearTime) / 1000;
    score++;
    scoreEl.textContent = score;
    reactionEl.textContent = `${reaction.toFixed(2)}s`;
    if (soundOn) {
      popSound.currentTime = 0;
      popSound.play();
    }
    clearTimeout(timer);
    gameArea.removeChild(bubble);
    setTimeout(spawnBubble, 600);
  });

  gameArea.appendChild(bubble);

  timer = setTimeout(() => {
    if (gameArea.contains(bubble)) {
      gameArea.removeChild(bubble);
      misses++;
      missesEl.textContent = misses;
      reactionEl.textContent = "Missed!";
      setTimeout(spawnBubble, 600);
    }
  }, difficulties[difficultySelect.value]);

  bubblesLeft--;
}

function startGame() {
  score = 0;
  misses = 0;
  bubblesLeft = totalBubbles;
  scoreEl.textContent = 0;
  missesEl.textContent = 0;
  reactionEl.textContent = "0.00s";
  startBtn.disabled = true;
  spawnBubble();
}

function endGame() {
  startBtn.disabled = false;
  reactionEl.textContent = "Game Over!";
  const best = Math.max(score, localStorage.getItem("highscore") || 0);
  localStorage.setItem("highscore", best);
  highScoreEl.textContent = best;
}

soundToggle.addEventListener("click", () => {
  soundOn = !soundOn;
  soundToggle.textContent = soundOn ? "🔊" : "🔇";
});

startBtn.addEventListener("click", startGame);

window.addEventListener("load", () => {
  highScoreEl.textContent = localStorage.getItem("highscore") || 0;
});
