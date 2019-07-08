// window.addEventListener('load', init);

//Global variables
let time =  60;
let score = 0;
let isPlaying;

//DOM elements
const wordInput = document.querySelector('#word-input')
const currentWord = document.querySelector('#current-word')
const timeDisplay = document.querySelector('#time')
const scoreDisplay = document.querySelector('#score')
const message = document.querySelector('#message')
const seconds = document.querySelector('#seconds')
const showName = document.querySelector('#show-name')
const selectBtn = document.querySelector('#select-id')

// create show dropdown options
fetch('http://localhost:3000/shows')
    .then(response => response.json())
    .then(function(shows){
      shows.forEach(function(show){
        selectBtn.innerHTML += `
        <option value=${show.id}>${show.name}</option>
        `
      })
      console.log(selectBtn)
    })


//words array
const words = []

selectBtn.addEventListener('change', function(e){
  //get quotes based on show selected
  getQuotes(selectBtn.value)

})

function getQuotes(show){
    fetch(`http://localhost:3000/shows/${show}/quotes`)
    .then(response => response.json())
    .then(function(quotes){
      quotes.forEach(function(quote){
        words.push(quote['quote'])
      })
    })
    .then(init)
}

//initialize game
function init(){
  //Select quotes from a certain show
  //load word from array
  showWord(words);
  //start matching on word input
  wordInput.addEventListener('input', startMatch)
  //call countdown every second
  setInterval(countdown, 1000);
  //check Game status
  setInterval(checkStatus, 50)
}
//Start match
function startMatch(){
  if(matchWords()){
    isPlaying = true;
    time = 6;//Don't reset the timer maybe?
    showWord(words);
    wordInput.value = '';
    score++;
  }
  scoreDisplay.innerHTML = score;
}

//Match currentWord to wordInput
function matchWords(){
  if(wordInput.value === currentWord.innerHTML){
    message.innerHTML = 'Correct!';
    return true;
  } else {
    message.innerHTML = '';
    return false;
  }
}

//pick and show random word
function showWord(words){
  //generate random array index
  const randIndex = Math.floor(Math.random() * words.length)
  //output random word
  currentWord.innerHTML = words[randIndex]
}
//Countdown timer
function countdown(){
  //Make sure time has not run out
  if(time > 0){
    //Decrement time
    time--;
  } else if(time === 0) {
    //Game is over
    isPlaying = false
  }
  //Show time
  timeDisplay.innerHTML = time;
}

//Check game status
function checkStatus(){
  if(!isPlaying && time === 0){
    message.innerHTML = 'Game Over'
    score = 0;
  }
}

// document.getElementById('personlist').getElementsByTagName('option')[11].selected = 'selected'

//game starts(init) with a button push
//add difficulty level(see video 26:30)
//add ability to change difficulty level
