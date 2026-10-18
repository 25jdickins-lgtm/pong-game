const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Game Objects
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, speedX: 5, speedY: 5 };
const player = { x: 10, y: canvas.height / 2 - 50, width: 10, height: 100, score: 0 };
const ai = { x: canvas.width - 20, y: canvas.height / 2 - 50, width: 10, height: 100, score: 0 };

// Keyboard Tracking
let upPressed = false;
let downPressed = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") upPressed = true;
    if (e.key === "ArrowDown") downPressed = true;
});
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp") upPressed = false;
    if (e.key === "ArrowDown") downPressed = false;
});

// Reset Ball Position
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = -ball.speedX;
}

// Game Loop Functions
function update() {
    // Move Player Paddle
    if (upPressed && player.y > 0) player.y -= 7;
    if (downPressed && player.y < canvas.height - player.height) player.y += 7;

    // Simple AI Paddle Logic
    if (ai.y + ai.height / 2 < ball.y) ai.y += 4;
    else ai.y -= 4;

    // Move Ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Wall Collisions (Top / Bottom)
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY = -ball.speedY;
    }

    // Check Paddle Hits
    let currentPaddle = (ball.x < canvas.width / 2) ? player : ai;
    if (detectCollision(ball, currentPaddle)) {
        ball.speedX = -ball.speedX;
    }

    // Score Tracking
    if (ball.x - ball.radius < 0) {
        ai.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
    }
}

function detectCollision(b, p) {
    return b.x + b.radius > p.x && b.x - b.radius < p.x + p.width &&
           b.y + b.radius > p.y && b.y - b.radius < p.y + p.height;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Elements
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(ai.x, ai.y, ai.width, ai.height);
    
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Scores
    ctx.font = "32px Courier New";
    ctx.fillText(player.score, canvas.width / 4, 50);
    ctx.fillText(ai.score, (canvas.width / 4) * 3, 50);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
