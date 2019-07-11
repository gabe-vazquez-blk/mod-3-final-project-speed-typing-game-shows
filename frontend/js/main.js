// ---- GLOBAL VARIABLES ----
let time;
let score = 0;
let isPlaying;
const quotes = []
let statusChecker;
let wordsTyped = []
let theScores = ''
let wpm = 0;



// ---- DOM ELEMENTS ---
const wordInput = document.querySelector('#word-input')
const currentQuote = document.querySelector('#current-quote')
const timeDisplay = document.querySelector('#time')
const scoreDisplay = document.querySelector('#score')
const wpmDisplay = document.querySelector('#wpm')
const message = document.querySelector('#message')
const seconds = document.querySelector('#seconds')
const showName = document.querySelector('#show-name')
const selectBtn = document.querySelector('#select-id')
const startBtn = document.querySelector('#start-button')
const audioDiv = document.querySelector('#audio')
const home = document.querySelector('#text-container')
const openPage = document.querySelector('#open-page')
const inGame = document.querySelector('#in-game')
inGame.style.display = 'none'
const mainBody = document.querySelector('#main-body')
const openPageLeaderboard = document.querySelector('#open-page-leaderboard')
let selections = document.getElementsByTagName('option')
let audio;
// ---- FETCHES ----
// FETCH TO GET NAME OF SHOWS FOR DROPDOWN
fetch('http://localhost:3000/shows')
  .then(response => response.json())
  .then((shows) => {
    appendShowsToDropdown(shows)
  })

// FETCH TO GET QUOTES
function getQuotes(showId){
  fetch(`http://localhost:3000/shows/${showId}/quotes`)
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
    .then(users => {
      users = users.sort((a, b) => {return b.score - a.score})
      createLeaderboard(users)
    })
    .then(next => {
      openPageLeaderboard.innerHTML +=
      `${theScores}`
    })

// FETCH TO GET AUDIO
function getAudio(showId){
  fetch(`http://localhost:3000/shows/${showId}`)
    .then(response => response.json())
    .then(show => appendAudio(show.audio_path))
    .then(showAudio => {
      audio = document.querySelector('#audio-button')
      audio.play()
    })
}

// FETCH GET BACKGROUND
function getBackground(showId){
  fetch(`http://localhost:3000/shows/${showId}`)
    .then(response => response.json())
    .then(show => appendBackground(show.background_url))
}

// FETCH TO POST NEW USER
function addUserToDB(username, score, wpm){
  fetch('http://localhost:3000/users',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: username,
      score: score,
      wpm: wpm
    })
  })
  .then(response => response.json())
}

// ---- HELPER FUNCTIONS ----
// APPEND SHOW DROPDOWN OPTIONS TO THE DOM
function appendShowsToDropdown(shows){
  shows.forEach((show) => {
    selectBtn.innerHTML += `
    <option id="${show.name}" value=${show.id}>${show.name}</option>
    `
  })
}

// START BUTTON EVENT LISTENER
startBtn.addEventListener('click', function(e){
  const showId = selectBtn.value
  getQuotes(showId)
  getAudio(showId)
  getBackground(showId)
  openPage.style.display = 'none'
  inGame.style.display = 'block'
  wordInput.focus()
})

// INITIALIZE GAME
function init(){
  time = 10
  // Select quotes from a certain show from 'quotes' array
  // Append quote to DOM
  showQuote(quotes);
  // Start matching on word input
  wordInput.addEventListener('input', startMatch)
  // Call countdown every second
  setInterval(countdown, 1000)
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
    wpm++
    if(currentQuoteArray.length === 0){
      score += 10
      message.innerHTML = `
        <h4 class="animated rotateIn text-success font-weight-bold"> +10 POINTS! </h4>
      `
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
      <h3>Game Over!</h3>
      <h1 class="inline-headers display-1 animated jello infinite ">Score: <span class="text-success font-weight-bold">${score}</span> WPM: <span class="text-success font-weight-bold">${wpm}</span></h1>
        <br>
        <div class="input-group row">
          <div class="col-xs-2 mx-auto text-center form-inline">
            <input type="text" id="save-user" placeholder="Name" class="form-control" autofocus>
            <div class="input-group-append">
              <button id="save-button" type="button" class="btn btn-light">Save Score</button>
            </div>
          </div>
        </div>
        <br><br><br>
      <h1>Leaderboard</h1>
        <div>
          ${theScores}
        </div>
        <br>
		  <button id="refresh" type="button" class="btn btn-light">Try Again</button>
    `
    const refresh = document.querySelector('#refresh')
    refresh.addEventListener('click', function(e){
      location.reload()
    })
    saveBtn()
    clearInterval(statusChecker)
    audio.pause()
  }
}

// ACTIVATE SAVE BUTTON
function saveBtn(){
  const saveBtn = document.querySelector('#save-button')
  const saveUserInput = document.querySelector('#save-user')
  saveBtn.addEventListener('click', () => {
    const username = saveUserInput.value
    addUserToDB(username, score, wpm)
    location.reload()
  })
}

// CREATE LEADERBOARD
function createLeaderboard(users){
  table = document.createElement('table')
  table.className = "table-bordered"
  table.innerHTML = `
    <th>User</th>
    <th>Score</th>
    <th>WPM</th>
  `
  users.forEach( user => {
    table.innerHTML += `
      <tr>
        <td>${user.name}</td>
        <td>${user.score}</td>
        <td>${user.wpm}</td>
      </tr>
    `
  })
  theScores = table.outerHTML
}

// APPEND AUDIO
function appendAudio(audioPath){
  audioDiv.innerHTML = `
    <audio hidden id="audio-button"  controls src="${audioPath}">
            Your browser does not support the
            <code>audio</code> element.
    </audio>
  `
}

// APPEND BACKGROUND
function appendBackground(backgroundUrl){
  mainBody.style.backgroundImage = `url(${backgroundUrl})`
}

// ---- NOTES ---
//document.getElementById('personlist').getElementsByTagName('option')[11].selected = 'selected'
//game starts(init) with a button push
//add difficulty level(see video 26:30)
//add ability to change difficulty level
