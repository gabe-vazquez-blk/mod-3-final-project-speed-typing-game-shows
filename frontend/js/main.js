// ---- GLOBAL VARIABLES ----
let time =  60;
let score = 0;
let isPlaying;
const quotes = []
let wordsTyped = []



// ---- DOM ELEMENTS ---
const wordInput = document.querySelector('#word-input')
const currentQuote = document.querySelector('#current-quote')
const timeDisplay = document.querySelector('#time')
const scoreDisplay = document.querySelector('#score')
const message = document.querySelector('#message')
const seconds = document.querySelector('#seconds')
const showName = document.querySelector('#show-name')
const selectBtn = document.querySelector('#select-id')
const startBtn = document.querySelector('#start-button')

// ---- FETCHES ----
// SHOW DROPDOWN OPTIONS
fetch('http://localhost:3000/shows')
  .then(response => response.json())
  .then(function(shows){
    shows.forEach(function(show){
      selectBtn.innerHTML += `
      <option value=${show.id}>${show.name}</option>
      `
    })
  })

// PUSH QUOTES TO QUOTES ARRAY
function getQuotes(show){
  fetch(`http://localhost:3000/shows/${show}/quotes`)
  .then(response => response.json())
  .then(function(quotesObj){
    quotesObj.forEach(function(quote){
      quotes.push(quote['quote'])
    })
  })
  .then(init)
}

// ---- HELPER FUNCTIONS ----
// START BUTTON EVENT LISTENER
startBtn.addEventListener('click', function(e){
  time = 60;
  getQuotes(selectBtn.value)
})

// INITIALIZE GAME
function init(){
  // Select quotes from a certain show from 'quotes' array
  // Append quote to DOM
  showQuote(quotes);
  // Start matching on word input
  wordInput.addEventListener('input', startMatch)
  // Call countdown every second
  setInterval(countdown, 1000);
  // Check Game status
  setInterval(checkStatus, 50)
}

// START MATCH
function startMatch(){
  if(matchquotes()){
    isPlaying = true
    showQuote(quotes)
  }
  scoreDisplay.innerHTML = score
}

// MATCH CURRENTQUOTE INDEXES TO WORD INPUT
function matchquotes(){
  const currentQuoteArray = currentQuote.innerHTML.split(' ')
  const word = wordInput.value
  let currentWord = currentQuoteArray[0] + ' '
  console.log(currentQuoteArray[0])

  if(word === currentWord){
    wordsTyped.push(word)
    message.innerHTML = 'Correct!'
    currentQuoteArray.shift()
    currentQuote.innerHTML = currentQuoteArray.join(' ')
    wordInput.value = ''
    score++
    if(currentQuoteArray.length === 0){
      score += 10
      return true
    }
  }
}

// PICK & SHOW RANDOM QUOTE
function showQuote(quotes){
  // Generate random array index
  const randIndex = Math.floor(Math.random() * quotes.length)
  // Output random quote
  currentQuote.innerHTML = quotes[randIndex]
}

// COUNTDOWN TIMER
function countdown(){
  // Make sure time has not run out
  if(time > 0){
    // Decrement time
    time--;
  } else if(time === 0) {
    // Game is over
    isPlaying = false
  }
  // Show time
  timeDisplay.innerHTML = time;
}

// CHECK GAME STATUS
function checkStatus(){
  if(!isPlaying && time === 0){
    let totalWords = wordsTyped.slice()
    let wpm = totalWords.length
    message.innerHTML = `
    'Game Over'
    <br>
    WPM - ${wpm}
    `
    score = 0;
  }
}

// ---- NOTES ---
//document.getElementById('personlist').getElementsByTagName('option')[11].selected = 'selected'
//game starts(init) with a button push
//add difficulty level(see video 26:30)
//add ability to change difficulty level
