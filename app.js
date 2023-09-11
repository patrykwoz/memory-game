const gameContainer = document.getElementById("game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

let counter = 0;

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    counter ++;

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    newDiv.id =counter;

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);



    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!

const  clickedCards = [];
const foundCards = [];

function handleCardClick(event) {
  // you can use event.target to see which element was clicked

  const clickedCard = event.target;
//   console.log(clickedCards.length)
  if (foundCards.findIndex(card => card.id === clickedCard.id) !== -1) {
    return;
  }

  if (clickedCards.length < 2
    && clickedCards.findIndex(card => card.id === clickedCard.id) === -1
    ){

    console.log("you just clicked", clickedCard);
    clickedCard.style.backgroundColor = clickedCard.classList[0];
    console.log("1", clickedCards);
    clickedCards.push(clickedCard);
    console.log("2",clickedCards);
    if (clickedCards.length >=2
        && ! haveSameClassValue(clickedCards)
        ){
            console.log("hi", haveSameClassValue(clickedCards));
            console.log("you just clicked", clickedCard);
            setTimeout(function(){
                clickedCards.forEach(div => div.style.backgroundColor = 'blue');
                clickedCards.splice(0,clickedCards.length);
            }, 1000);
    
    }
    if (clickedCards.length >= 2
        && haveSameClassValue(clickedCards)
        ){
            
            foundCards.push(clickedCards);
            console.log("match!");
            console.log("you just clicked", clickedCard);
        
            clickedCards.splice(0,clickedCards.length);
      }
}

// haveSameClassValue(clickedCards);
// console.log(haveSameClassValue(clickedCards));

}

function displayFoundCards(cards){
    for (let el in cards){
        document.querySelectorAll('#game div').forEach(div => {
            if (div.className === el.className){
                div.style.backgroundColor = div.className;
            } else {
                return;
            }
            
        });

    }
}


function haveSameClassValue(arr) {
  if (arr[0].className === arr[1].className){
    return true;
  } else {
    return false;
  }
}

// when the DOM loads
createDivsForColors(shuffledColors);
