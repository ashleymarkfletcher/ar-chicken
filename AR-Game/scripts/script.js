var Scene = require('Scene')
var Diagnostics = require('Diagnostics')
var TouchGestures = require('TouchGestures')
var Time = require('Time')
var FaceTracking = require('FaceTracking')
var Animation = require('Animation')
var Reactive = require('Reactive')

import countdown from './countdown'
import collision from './collision'
import randomNum from './random'

// main scene objects
var sceneRoot = Scene.root
  .child('Device')
  .child('Camera')
  .child('Focal Distance')
var scoreTextContainer = sceneRoot.child('2DCanvas0')
var scoreText = scoreTextContainer.child('scoreText')
var livesText = sceneRoot
  .child('lives')
  .child('2DCanvas1')
  .child('text1')
var faceTracker = Scene.root
  .child('Device')
  .child('Camera')
  .child('Focal Distance')
  .child('facetracker0')
var mouthIsOpen = FaceTracking.face(0)
  .mouth.openness.gt(0.3)
  .and(FaceTracking.count.gt(0))
var mouthCenter = FaceTracking.face(0).mouth.center
var endScreen = sceneRoot.child('endScreen')
var startScreen = sceneRoot.child('startScreen')
var endScreenScore = endScreen.child('2DCanvas1').child('scoreText')
var restartButton = endScreen.child('2DCanvas1').child('restartButton')
var startButton = startScreen.child('2DCanvas1').child('startButton')

var chicken0 = sceneRoot.child('chicken0')
var chicken1 = sceneRoot.child('chicken1')
var chicken2 = sceneRoot.child('chicken2')
var chickens = [{ element: chicken0 }, { element: chicken1 }, { element: chicken2 }]

// lives display
var livesContainer = sceneRoot.child('lives')
var life0 = livesContainer.child('life0')
var life1 = livesContainer.child('life1')
var life2 = livesContainer.child('life2')
var life3 = livesContainer.child('life3')
var life4 = livesContainer.child('life4')
var livesDisplayElements = [life0, life1, life2, life3, life4]
const countdownContainer = sceneRoot.child('countdown')
const countdownText = countdownContainer.child('text')

// global score
var score = 0
var level2 = 10

// speed/time of falling animation
var startAnimationTime = 4000
var chickenAnimationTime

// x and y for hit detection
var maxYdistance = 15
var maxXdistance = 15

var loseLifeBoundary = -15 // below Y line where you lose a life
var initialLives = 5
var lives = 0
var gameState = 'start'

var fallMode = 'single' // 'multiple' - how many chickens at once
// var fallMode = 'multiple' //  - how many chickens at once

var randomInterval = function(chicken) {
  var randomTime = Math.floor(Math.random() * 3000) + 1000 // 1000 - 4000

  chicken.randomTimeId = Time.setTimeout(function() {
    chicken.element.hidden = false
    chicken.mover = moveChicken(chicken)
  }, randomTime)
}

var randomChicken = function() {
  var randomChicken = randomNum(0, 3) // 0-2
  var chicken = chickens[randomChicken]

  chicken.mover = moveChicken(chicken)
}

// hides/shows element
var toggleElement = function(character, hide) {
  if (typeof hide === 'undefined') {
    character.element.hidden = !character.element.hidden
  } else {
    character.element.hidden = hide
  }
}

var updateScore = function(amount) {
  score += amount
  scoreText.text = 'score: ' + score.toString()
  endScreenScore.text = 'Congratulations!\n You Scored:\n ' + score.toString()

  if (score >= level2) {
    chickenAnimationTime = 2000
  }
}

var moveChicken = function(chickenObject) {
  var driver = Animation.timeDriver({
    durationMilliseconds: chickenAnimationTime,
    loopCount: 1, // can be Infinity
    mirror: false
  })
  var chicken = chickenObject.element
  var sampler = Animation.samplers.linear(27, -30)
  var animationSignal = Animation.animate(driver, sampler)
  chickenObject.animationSignal = animationSignal
  chickenObject.animationDriver = driver
  chicken.transform.y = animationSignal

  driver.start()

  driver.onCompleted().subscribe(function(e) {
    if (gameState === 'playing' && fallMode == 'multiple') randomInterval(chickenObject)
    if (gameState === 'playing' && fallMode == 'single') randomChicken()
  })

  // monitor chicken off screen for lose life
  chickenObject.animationSignal
    .lt(loseLifeBoundary)
    .monitor()
    .subscribe(function(e) {
      const thisChicken = chicken
      updateLives(-1)
    })
}

var mouthSub = mouthIsOpen.monitor().subscribe(function(e) {
  var mouthX, mouthY
  if (e.newValue == true && gameState === 'playing') {
    var mouthX = mouthCenter.x.lastValue
    var mouthY = mouthCenter.y.lastValue

    // check for collisions
    chickens.forEach(function(chickenObject) {
      var chicken = chickenObject.element
      var chickenX = chicken.transform.x.lastValue
      var chickenY = chicken.transform.y.lastValue

      if (collision(mouthX, mouthY, chickenX, chickenY, maxXdistance, maxYdistance)) {
        updateScore(5)
        chickenObject.animationDriver.reset()
      }
    })
  } else {
    // e.unsubscribe()
  }
})

// start game
var startGame = function() {
  gameState = 'playing'
  scoreText.text = 'score: ' + score.toString()
  lives += initialLives
  livesContainer.hidden = false
  faceTracker.hidden = false
  scoreTextContainer.hidden = false
  startScreen.hidden = true
  chickenAnimationTime = startAnimationTime
  updateLivesDisplay(lives)

  if (fallMode == 'single') {
    randomChicken()
  } else if (fallMode == 'multiple') {
    chickens.forEach(function(chicken) {
      randomInterval(chicken)
    })
  }
}

var updateLives = function(amount) {
  if (!lives) {
    Diagnostics.log('game over!')
    endGame()
  } else {
    lives += amount
    updateLivesDisplay(lives)
  }
}

// show and hide number of lives based on scene objects instead of text
var updateLivesDisplay = function(numLives) {
  livesDisplayElements.forEach(function(lifeElement, index) {
    lifeElement.hidden = !(index < numLives)
  })
}

var showEndScreen = function(show) {
  endScreenScore.text = 'Congratulations!\n You Scored:\n ' + score.toString()
  endScreen.hidden = !show
}

var endGame = function() {
  gameState = 'stopped'
  livesContainer.hidden = true
  faceTracker.hidden = true
  scoreTextContainer.hidden = true
  showEndScreen(true)

  chickens.forEach(function(chicken) {
    if (chicken.animationDriver) {
      chicken.animationDriver.reset()
      chicken.animationDriver.stop()
    }
    if (chicken.randomTimeId) Time.clearTimeout(chicken.randomTimeId)
  })
}

// after tap to restart, restart the game
const restartGame = () => {
  showEndScreen(false)
  score = 0
  startGame()
}

var restartTapRegistrar = function(element) {
  TouchGestures.onTap(element).subscribe(function(event) {
    Diagnostics.log('restart!')
    restartGame()
  })
}

var startTapRegistrar = function(element) {
  TouchGestures.onTap(element).subscribe(function(event) {
    Diagnostics.log('start!')
    show(countdownContainer)
    countdown(
      5,
      0,
      1000,
      count => updateText(countdownText, count.toString()),
      () => {
        hide(countdownContainer)
        startGame()
      }
    )
  })
}

const updateText = (element, text) => {
  element.text = text
}

const toggle = (element, hide) => (element.hidden = hide)
const hide = element => toggle(element, true)
const show = element => toggle(element, false)

// subscribe to restart button tap
restartTapRegistrar(restartButton)
startTapRegistrar(startButton)
