var Scene = require('Scene');
var Diagnostics = require('Diagnostics');
var TouchGestures = require("TouchGestures");
var Time = require('Time')
var FaceTracking = require('FaceTracking');
var Animation = require('Animation');
var Reactive = require('Reactive')

// main scene objects
var sceneRoot = Scene.root.child("Device").child("Camera").child("Focal Distance")
var scoreText = sceneRoot.child("2DCanvas0").child("text0")
var faceTracker = Scene.root.child("Device").child("Camera").child("Focal Distance").child("facetracker0");
var mouthIsOpen = FaceTracking.face(0).mouth.openness.gt(0.3).and(FaceTracking.count.gt(0));
var mouthCenter = FaceTracking.face(0).mouth.center;

var chicken0 = sceneRoot.child("chicken0")
var chicken1 = sceneRoot.child("chicken1")
var chicken2 = sceneRoot.child("chicken2")

var chickens = [
    { element: chicken0 },
    { element: chicken1 },
    { element: chicken2 }
]

var score = 0
var chickenAnimationTime = 4000

var randomInterval = function (chicken) {
    var randomTime = Math.floor(Math.random() * 3000) + 1000 // 1000 - 4000
    var elementName = chicken.element.name

    chicken.randomTimeId = Time.setTimeout(function () {
        chicken.element.hidden = false
        moveChicken(chicken)
    }, randomTime)
}

// hides/shows element
var toggleElement = function (character, hide) {
    if (typeof hide === 'undefined') {
        character.element.hidden = !character.element.hidden
    } else {
        character.element.hidden = hide
    }
}

var updateScore = function (amount) {
    score += amount
    scoreText.text = "score: " + score.toString()
}

var moveChicken = function (chickenObject) {
    var driver = Animation.timeDriver({
        durationMilliseconds: chickenAnimationTime,
        loopCount: 1, // can be Infinity
        mirror: false
    })
    var chicken = chickenObject.element
    var sampler = Animation.samplers.linear(27, -40);
    chicken.transform.y = Animation.animate(driver, sampler);

    driver.start()

    driver.onCompleted().subscribe(function (e) {
        randomInterval(chickenObject)
    })
}

var mouthSub = mouthIsOpen.monitor().subscribe(function (e) {
    var mouthX, mouthY
    if (e.newValue == true) {

        var mouthX = mouthCenter.x.lastValue
        var mouthY = mouthCenter.y.lastValue

        var maxYdistance = 15
        var maxXdistance = 15

        // check for collisions
        chickens.forEach(function (chickenObject) {
            var chicken = chickenObject.element
            var chickenX = chicken.transform.x.lastValue
            var chickenY = chicken.transform.y.lastValue

            if (collision(mouthX, mouthY, chickenX, chickenY, maxXdistance, maxYdistance)) {

                updateScore(5)
                // Diagnostics.log('collliiiidee mouth: ' + mouthX + ':' + mouthY + ' chick: ' + chickenX + ':' + chickenY)
                Diagnostics.log('collide!')
                toggleElement(chickenObject, true)

            }
        })
    } else {
        // e.unsubscribe()
    }
})

var collision = function (x1, y1, x2, y2, distanceX, distanceY) {
    // return x1 < x2 + distanceX &&
    //     x1 + distanceX > x2 &&
    //     y1 < y2 + distanceY &&
    //     distanceY + y1 > y2
    var xs = x2 - x1
    var ys = y2 - y1;

    xs *= xs;
    ys *= ys;
    Diagnostics.log(Math.sqrt(xs + ys))

    // return Math.sqrt(xs + ys) <= distanceX

    return Math.hypot(x2 - x1, y2 - y1) <= distanceX
}

// initialize game
var run = function () {
    scoreText.text = "score: " + score.toString()

    chickens.forEach(function (chicken) {
        randomInterval(chicken)
    })
}

// start the game
run()
