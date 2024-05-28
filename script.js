const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const welcomeScreen = document.getElementById('welcomeScreen');
const startButton = document.getElementById('startButton');
const winScreen = document.getElementById('winScreen');
const restartButton = document.getElementById('restartButton');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player, enemies, points;
let isGameOver = false; // Flaga stanu gry

function initGame() {
    isGameOver = false;
    player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 20,
        color: 'blue',
        speed: 3
    };

    enemies = [];
    points = [];

    for (let i = 0; i < 10; i++) {
        enemies.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 15,
            color: 'red',
            speed: Math.random() * 1 + 0.5
        });
        points.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 5,
            color: 'green'
        });
    }
}

let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

function drawCircle(x, y, radius, color) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
}

function updatePlayer() {
    const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    player.x += Math.cos(angle) * player.speed;
    player.y += Math.sin(angle) * player.speed;

    if (player.x - player.radius < 0) player.x = player.radius;
    if (player.x + player.radius > canvas.width) player.x = canvas.width - player.radius;
    if (player.y - player.radius < 0) player.y = player.radius;
    if (player.y + player.radius > canvas.height) player.y = canvas.height - player.radius;
}

function updateEnemies() {
    enemies.forEach(enemy => {
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        enemy.x += Math.cos(angle) * enemy.speed;
        enemy.y += Math.sin(angle) * enemy.speed;
    });
}

function checkCollisions() {
    points.forEach((point, index) => {
        const dist = Math.hypot(player.x - point.x, player.y - point.y);
        if (dist - player.radius - point.radius < 1) {
            points.splice(index, 1);
            player.radius += 2;
        }
    });

    enemies.forEach(enemy => {
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist - player.radius - enemy.radius < 1) {
            isGameOver = true;
        }
    });
}

function checkWinCondition() {
    if (points.length === 0 && !isGameOver) {
        canvas.style.display = 'none';
        winScreen.style.display = 'flex';
    }
}

function gameLoop() {
    if (isGameOver) {
        alert('Game Over!');
        document.location.reload();
        return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawCircle(player.x, player.y, player.radius, player.color);

    points.forEach(point => drawCircle(point.x, point.y, point.radius, point.color));
    enemies.forEach(enemy => drawCircle(enemy.x, enemy.y, enemy.radius, enemy.color));

    updatePlayer();
    updateEnemies();
    checkCollisions();
    checkWinCondition();

    requestAnimationFrame(gameLoop);
}

startButton.addEventListener('click', () => {
    welcomeScreen.style.display = 'none';
    canvas.style.display = 'block';
    initGame();
    gameLoop();
});

restartButton.addEventListener('click', () => {
    winScreen.style.display = 'none';
    canvas.style.display = 'block';
    initGame();
    gameLoop();
});
