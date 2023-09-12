const gameContainer = document.getElementById("game");
const body = document.body;

function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = [];
let counter = 0;
let score = 0;
let toWin = 0;
let timer = 33;
let bestScore = "-";

function storeBestScore() {
  if (bestScore === "-" || score > bestScore) {  // assuming a higher score is better - thhe highest number of for a given timeer
    bestScore = score;
    localStorage.setItem('bestScore', bestScore);
  }
}

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");
    counter++;
    newDiv.classList.add(color);
    newDiv.id = counter;
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
  const timeCounterText = document.createElement('h2');
  timeCounterText.id = "time-counter";
  timeCounterText.innerText = timer;
  timeCounterText.style.color = 'red';
  document.querySelector('div.container').prepend(timeCounterText);
}

function displayScreen(content, buttonText, buttonAction) {
  const newDiv = document.createElement("div");
  const newH1 = document.createElement("h1");
  const newH2 = document.createElement("h2");
  const tScore = document.createElement("h2");
  const startBtn = document.createElement("button");

  newH1.id = "game-heading";
  newH1.innerHTML = "Match -A- Beaver".replace(/ /g, "<br>");
  newH2.innerHTML = content.text;
  newH2.style.color = content.color;

  tScore.innerHTML = content.scoreText;
  tScore.style.color = "magenta";

  startBtn.id = "start-button";
  startBtn.classList.add("start-button");
  startBtn.innerText = buttonText;
  startBtn.addEventListener("click", buttonAction);

  newDiv.classList.add("start-screen");
  newDiv.appendChild(newH1);
  if (content.text.length>0){newDiv.appendChild(newH2)};
  newDiv.appendChild(tScore);
  if (content.includeRange) {
    const { newLabel, newRange, displayValue } = createRange();
    newDiv.appendChild(newLabel);
    newDiv.appendChild(newRange);
    newDiv.appendChild(displayValue);
  }
  newDiv.appendChild(startBtn);
  body.prepend(newDiv);
}

function startScreen() {
  displayScreen({ text: '', scoreText: `Best Score: ${bestScore}`, color: "magenta", includeRange: true }, "START", handleButtonClick);
}

function winScreen() {
  storeBestScore();
  displayScreen({ text: `You Win`, scoreText:`Best Score: ${bestScore}`, color: "green", includeRange: true }, "RESTART", handleButtonClick);
}

function loseScreen() {
  storeBestScore();
  displayScreen({ text: `You Lose`, scoreText: `Best Score: ${bestScore}`, color: "red", includeRange: true }, "RESTART", handleButtonClick);
}

function createRange() {
  const newLabel = document.createElement('label');
  const newRange = document.createElement("input");
  const displayValue = document.createElement('span');

  newRange.id = 'difficulty';
  newRange.type = 'range';
  newLabel.setAttribute('for', 'difficulty');
  newLabel.innerText = 'set difficulty: ';
  newRange.value = 8;
  newRange.min = 4;
  newRange.max = 36;
  newRange.step = 2;

  displayValue.textContent = newRange.value;

  // Add an event listener to the range input
  newRange.addEventListener('input', function() {
    displayValue.textContent = newRange.value;
  });

  // Return an object with the elements
  return { newLabel, newRange, displayValue };
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function getRandomColors(n) {
  const colors = [];
  for (let i = 0; i < n; i++) {
      colors.push(getRandomColor());
  }
  return colors;
}

const clickedCards = [];
const foundCards = [];

function clearGame() {
  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }
  let timeCounterR = document.querySelectorAll('#time-counter');
  timeCounterR.forEach(counter => counter.remove());


  let startScreens = document.querySelectorAll('.start-screen');
  startScreens.forEach(screen => screen.remove());
}

function handleButtonClick(event) {
  const rangeValue = document.querySelector('#difficulty') ? document.querySelector('#difficulty').value : 8;
  console.log(document.querySelector('#difficulty').value)
  clearGame();
  
  console.log(rangeValue);
  const nColors = getRandomColors(rangeValue / 2);
  const COLORS = [].concat(...nColors.map(item => [item, item]));
  timer = 34;
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  toWin = shuffledColors.length / 2;
  document.querySelectorAll('#game div').forEach(div => div.style.backgroundColor = 'black');
  
  const timeCounter = setInterval(function () {
    timer--;
    document.querySelector('#time-counter').innerText = timer;
    if (toWin > 0 && timer <= 0) {
      clearInterval(timeCounter);
      loseScreen();
    } else if (timer <=0){
      clearInterval(timeCounter);

    }
  }, 1000);
  
}

function handleCardClick(event) {
  const clickedCard = event.target;
  if (foundCards.includes(clickedCard)) return;
  if (clickedCards.length < 2 && !clickedCards.includes(clickedCard)) {
    clickedCard.style.backgroundColor = clickedCard.classList[0];
    clickedCards.push(clickedCard);
    if (clickedCards.length === 2) {
      if (clickedCards[0].className === clickedCards[1].className) {
        foundCards.push(...clickedCards);
        score++;
        toWin--;
        if (toWin <= 0) winScreen();
        clickedCards.length = 0;
      } else {
        setTimeout(function () {
          clickedCards.forEach(div => div.style.backgroundColor = 'black');
          clickedCards.length = 0;
        }, 1000);
      }
    }
  }
}

bestScore = localStorage.getItem('bestScore') || "-"; 
startScreen();
