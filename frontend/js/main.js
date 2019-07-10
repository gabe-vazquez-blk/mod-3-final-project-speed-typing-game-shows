// ---- GLOBAL VARIABLES ----
let time;
let score = 0;
let isPlaying;
const quotes = []
let statusChecker;
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
const row = document.querySelector('.row') // just to test leaderboard
const home = document.querySelector('#text-container')


// ---- FETCHES ----
// FETCH TO GET NAME OF SHOWS FOR DROPDOWN
fetch('http://localhost:3000/shows')
  .then(response => response.json())
  .then((shows) => {
    appendShowsToDropdown(shows)
  })

// FETCH TO GET QUOTES
function getQuotes(show){
  fetch(`http://localhost:3000/shows/${show}/quotes`)
    .then(response => response.json())
    .then((quotesObj) => {
      quotesObj.forEach((quote) => {
        quotes.push(quote['quote'])
      })
    })
    .then(init)
}

// FETCH TO GET USERS
const leaderboard =
  fetch('http://localhost:3000/users')
    .then(response => response.json())
    // .then(json => console.log(json))
    .then(users => {
      createLeaderboard(users)
    })


// FETCH TO POST NEW USER
function addUserToDB(username, score){
  fetch('http://localhost:3000/users',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: username,
      score: score
    })
  })
  .then(response => response.json())
}

// ---- HELPER FUNCTIONS ----
// APPEND SHOW DROPDOWN OPTIONS TO THE DOM
function appendShowsToDropdown(shows){
  shows.forEach((show) => {
    selectBtn.innerHTML += `
    <option value=${show.id}>${show.name}</option>
    `
  })
}

// START BUTTON EVENT LISTENER
startBtn.addEventListener('click', function(e){
  message.innerHTML = 'Begin!'
  getQuotes(selectBtn.value)
})

// INITIALIZE GAME
function init(){
  time = 1
  // Select quotes from a certain show from 'quotes' array
  // Append quote to DOM
  showQuote(quotes);
  // Start matching on word input
  wordInput.addEventListener('input', startMatch)
  // Call countdown every second
  setInterval(countdown, 1000);
  // Check Game status
  statusChecker = setInterval(checkStatus, 50)
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
  if(word === currentWord && time !== 0){
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
    home.innerHTML =
    `
      <h1>Congratulations!</h1>
	      <div class="leaderboard">
          Leaderboard
          <div class="leaders">
            ${leaderboard}
          </div>
        </div>
		    <button id="refresh" type="button" name="button">Try Again</button>

    `
    const refresh = document.querySelector('#refresh')
    refresh.addEventListener('click', function(e){
      location.reload()
    })
    // currentQuote.innerHTML = ''
    // message.innerHTML = `
    // <p>Game Over</p>
    // <br>
    // <input type="text" id="save-user" placeholder="Name" autofocus>
    // <button id="save-button" type="button">Save Game</button>
    // `
    // saveBtn()
    clearInterval(statusChecker)
  }
}

// ACTIVATE SAVE BUTTON
function saveBtn(){
  const saveBtn = document.querySelector('#save-button')
  const saveUserInput = document.querySelector('#save-user')
  saveBtn.addEventListener('click', () => {
    const username = saveUserInput.value
    addUserToDB(username, score)
  })
}

// CREATE LEADERBOARD
function createLeaderboard(users){
  const leaderboard = document.createElement('table')
  users.forEach( user => {
    leaderboard.innerHTML += `
      <tr>
        <td>${user.name}</td>
        <td>${user.score}</td>
      </tr>
    `
  })
}


// ---- NOTES ---
//document.getElementById('personlist').getElementsByTagName('option')[11].selected = 'selected'
//game starts(init) with a button push
//add difficulty level(see video 26:30)
//add ability to change difficulty level
