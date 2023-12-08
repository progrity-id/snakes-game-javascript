const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score")
const controls = document.querySelectorAll(".controls i");
const resetHighScoreButton = document.getElementById('resetHighScoreButton');
const startButton = document.getElementById('startButton');
const customButton = document.getElementById('customButton');
const levelButtons = document.querySelectorAll(".level-button");

let gameStarted = false;
let snakeBody = [];
let snakeX = 10, snakeY = 10;
let foodX, foodY;
let velocityX = 0, velocityY = 0;
let gameOver = false;
let setIntervalId
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

startButton.addEventListener('click', () => {
    if(!gameStarted) {
        gameStarted = true;
        gameOver = false;
        snakeX = 10;
        snakeY = 10;
        velocityX = 0;
        velocityY = 0;
        snakeBody = [];
        score = 0;
        setLevelSpeed(score);

        highScoreElement.innerText = `High Score: ${highScore}`;

        startButton.style.display = "none";

        customButton.style.display = "none";

        updateFoodPosition();

        initGame();
    }
    document.addEventListener("keydown", (e) => {
        if(gameStarted &&!gameOver) {
            changeDirection(e);
        }
    });
});

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() *30) + 1;
    foodY = Math.floor(Math.random() *30) + 1;
}

const handleGameOver = () => {
    if (!gameOver) {
        gameOver = true;
        clearInterval(setIntervalId);

        Swal.fire({
            icon : 'error',
            title: 'GAME OVER',
            text: 'Silahkan coba lagi...',
            background: 'black',
            color: 'white',
        }).then((result) => {
            if(result.isConfirmed) {
                location.reload();
            } else {
                location.reload();
            }
        });
    }
}

const changeDirection = e => {
    if (document.getElementById('isiKustom').hidden == true) {
    if(e.key === localStorage.getItem('input1') && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === localStorage.getItem('input2') && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === localStorage.getItem('input3') && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === localStorage.getItem('input4') && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
    }
}

controls.forEach(button => button.addEventListener("click", () => changeDirection({key: button.dataset.key})));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html ="";
    if(gameStarted) {
        html +=`<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score = score + 4;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    if(snakeX <= 1) {
        snakeX = 30;
    } else if (snakeX > 31) {
        snakeX = 1
    }
    if(snakeY <= 1) {
        snakeY = 30;
    } else if (snakeY > 31) {
        snakeY = 1
    }

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            handleGameOver();
        }        
    }
    playBoard.innerHTML = html;
    }
}

customButton.addEventListener('click', ()=> {
    startButton.style.display = "none";
    if(document.getElementById('isiKustom').hidden == true){
        clearInterval(setIntervalId);
        document.getElementById('isiKustom').hidden = false;
        
    }else{

        document.getElementById('isiKustom').hidden = true;
        startButton.style.display = "block";
    }
});


const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const input3 = document.getElementById('input3');
const input4 = document.getElementById('input4');

input1.value = localStorage.getItem('input1') || '';
input2.value = localStorage.getItem('input2') || '';
input3.value = localStorage.getItem('input3') || '';
input4.value = localStorage.getItem('input4') || '';

input1.addEventListener('keydown', function(event) {
    input1.value = event.key;
    localStorage.setItem('input1', input1.value);
});

input2.addEventListener('keydown', function(event) {
    input2.value = event.key;
    localStorage.setItem('input2', input2.value);
});

input3.addEventListener('keydown', function(event) {
    input3.value = event.key;
    localStorage.setItem('input3', input3.value);
});

input4.addEventListener('keydown', function(event) {
    input4.value = event.key;
    localStorage.setItem('input4', input4.value);
});

resetHighScoreButton.addEventListener('click', () => {
    Swal.fire({
        icon: 'warning',
        title: 'RESET HIGH SCORE',
        text: 'Yakin Anda Ingin Me-reset High Score?',
        showCancelButton: true,
        confirmButtonText: 'YA',
        cancelButtonText: "BATAL",        
        background: 'black',
        color: 'white',
    }).then((result) => {
        if(result.isConfirmed) {
        highScore = 0;
        localStorage.setItem("high-score", highScore);
        highScoreElement.innerText = `High Score: ${highScore}`;
        }
    });
});

function setLevelSpeed(level) {
    let speed;
    switch (level) {
        case 1:
            speed = 120;
            break;
        case 2:
            speed = 90;
            break;
        case 3:
            speed = 75;
            break;
        case 4:
            speed = 40;
            break;
        case 5:
            speed = 15;
            break;
        default:
            speed = 120;   
    }
    clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, speed);
}

levelButtons.forEach(button => {
    button.addEventListener('click', () => {
        const level = parseInt(button.dataset.level);
        setLevelSpeed(level);
    });
});

updateFoodPosition();
document.addEventListener("keydown", changeDirection);