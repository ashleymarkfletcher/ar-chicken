// The requires don't get left intact by webpack by using the externals in the config
var Scene = require('Scene')
var Diagnostics = require('Diagnostics')
var TouchGestures = require('TouchGestures')
var Time = require('Time')
var FaceTracking = require('FaceTracking')
var Animation = require('Animation')
var Reactive = require('Reactive')

// import countdown from './countdown'
// import collision from './collision'
import {
  toggle,
  hide,
  show,
  updateText,
  tapRegistrar,
  getChildren,
  hideMultiple,
  showMultiple,
  randomNum,
  randomElement,
  collision,
  countdown
} from './util'

// main scene objects
const sceneRoot = Scene.root
  .child('Device')
  .child('Camera')
  .child('Focal Distance')

// score
const scoreTextContainer = sceneRoot.child('scoreContainer')
const scoreText = scoreTextContainer.child('scoreText')

// lives
const livesText = sceneRoot
  .child('lives')
  .child('2DCanvas1')
  .child('text1')

// face
const faceTracker = Scene.root
  .child('Device')
  .child('Camera')
  .child('Focal Distance')
  .child('facetracker0')
const mouthCenter = FaceTracking.face(0).mouth.center
const mouthIsOpen = FaceTracking.face(0)
  .mouth.openness.gt(0.3)
  .and(FaceTracking.count.gt(0))

// start screen
const startScreen = sceneRoot.child('startScreen')
const startButton = startScreen.child('2DCanvas1').child('startButton')

// countdown
const countdownContainer = sceneRoot.child('countdown')
const countdownText = countdownContainer.child('text')

// end screen
const endScreen = sceneRoot.child('endScreen')
const endScreenScore = endScreen.child('2DCanvas1').child('scoreText')
const restartButton = endScreen.child('2DCanvas1').child('restartButton')

// chickens
const numChickens = 3
const chickenElements = getChildren(sceneRoot, 'chicken', numChickens)
const chickens = chickenElements.map(element => ({ element }))

// lives
const livesContainer = sceneRoot.child('lives')
const initialLives = 5
const livesDisplayElements = getChildren(livesContainer, 'life', initialLives)

// global score
let score = 0
const level2 = 10

// chicken start point and end
const chickenStart = 27
const chickenEnd = -30

// speed/time of falling animation
const startAnimationTime = 4000
let chickenAnimationTime

// x and y for hit detection
const maxYdistance = 15
const maxXdistance = 15

// below Y line where you lose a life
const loseLifeBoundary = -15

// lives
let lives = 0

// tracks the state of the game
let gameState = 'start'

// how many chickens fall at once
const fallMode = 'single'
// const fallMode = 'multiple'

const randomInterval = chicken => {
  const randomTime = Math.floor(Math.random() * 3000) + 1000 // 1000 - 4000

  chicken.randomTimeId = Time.setTimeout(() => {
    show(chicken.element)
    moveChicken(chicken)
  }, randomTime)
}

const moveRandomChicken = () => moveChicken(randomElement(chickens))

const updateScore = amount => {
  score += amount
  updateText(scoreText, 'score: ' + score.toString())
  updateText(endScreenScore, 'Congratulations!\n\n You Scored:\n\n ' + score.toString())

  // Test for Leveling up
  // if (score >= level2) {
  //   chickenAnimationTime = 2000
  // }
}

const moveChicken = chicken => {
  let driver = Animation.timeDriver({
    durationMilliseconds: chickenAnimationTime,
    loopCount: 1, // can be Infinity
    mirror: false
  })

  // let chicken = chicken.element
  const sampler = Animation.samplers.linear(chickenStart, chickenEnd)
  const animationSignal = Animation.animate(driver, sampler)
  chicken.animationSignal = animationSignal
  chicken.animationDriver = driver
  chicken.element.transform.y = animationSignal

  driver.start()

  driver.onCompleted().subscribe(e => {
    if (gameState === 'playing' && fallMode == 'multiple') randomInterval(chicken)
    if (gameState === 'playing' && fallMode == 'single') moveRandomChicken()
  })

  // monitor chicken off screen for life--
  chicken.animationSignal
    .lt(loseLifeBoundary)
    .monitor()
    .subscribe(e => {
      updateLives(-1)
    })
}

const mouthSub = mouthIsOpen.monitor().subscribe(e => {
  if (e.newValue && gameState === 'playing') {
    const mouthX = mouthCenter.x.lastValue
    const mouthY = mouthCenter.y.lastValue

    // check for collisions
    chickens.forEach(chicken => {
      const chickenX = chicken.element.transform.x.lastValue
      const chickenY = chicken.element.transform.y.lastValue

      if (collision(mouthX, mouthY, chickenX, chickenY, maxXdistance, maxYdistance)) {
        updateScore(5)
        // move chicken back to top
        chicken.animationDriver.reset()
      }
    })
  } else {
    // e.unsubscribe()
  }
})

const countdownAnimation = () => {
  let driver = Animation.timeDriver({
    durationMilliseconds: 1000,
    loopCount: 12, // can be Infinity
    mirror: false
  })

  // let chicken = chicken.element
  const sampler = Animation.samplers.easeOutCubic(1, 1.5)
  const animationSignal = Animation.animate(driver, sampler)

  countdownContainer.transform.scaleX = animationSignal
  countdownContainer.transform.scaleY = animationSignal
  // countdownContainer.transform.scaleZ = animationSignal

  driver.start()
}

// start game
const startGame = () => {
  gameState = 'playing'
  score = 0
  updateText(scoreText, 'score: ' + score.toString())
  lives += initialLives
  hide(startScreen)
  showMultiple([livesContainer, faceTracker, scoreTextContainer])
  chickenAnimationTime = startAnimationTime
  updateLivesDisplay(lives)

  if (fallMode == 'single') {
    moveRandomChicken(numChickens)
  } else if (fallMode == 'multiple') {
    chickens.forEach(chicken => {
      randomInterval(chicken)
    })
  }
}

const updateLives = amount => {
  if (!lives) {
    endGame()
  } else {
    lives += amount
    updateLivesDisplay(lives)
  }
}

// show and hide number of lives based on scene objects instead of text
const updateLivesDisplay = numLives => {
  livesDisplayElements.forEach((lifeElement, index) => {
    toggle(lifeElement, !(index < numLives))
  })
}

const endGame = () => {
  gameState = 'stopped'
  hideMultiple([livesContainer, faceTracker, scoreTextContainer])
  updateText(endScreenScore, 'Congratulations!\n\n You Scored:\n\n ' + score.toString())
  show(endScreen)

  chickens.forEach(chicken => {
    if (chicken.animationDriver) {
      chicken.animationDriver.reset()
      chicken.animationDriver.stop()
    }
    if (chicken.randomTimeId) Time.clearTimeout(chicken.randomTimeId)
  })
}

// after tap to restart, restart the game
const restartGame = () => {
  hide(endScreen)
  startGame()
}

// subscribe to restart/start button taps
const startTap = tapRegistrar(startButton, event => {
  hide(startScreen)
  show(countdownContainer)

  countdownAnimation()
  countdown(
    3,
    0,
    1000,
    count => updateText(countdownText, count.toString()),
    () => {
      hide(countdownContainer)
      startGame()
    }
  )
})

const restartTap = tapRegistrar(restartButton, event => {
  restartGame()
})
