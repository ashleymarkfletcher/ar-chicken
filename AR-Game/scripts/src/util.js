var TouchGestures = require('TouchGestures')
var Diagnostics = require('Diagnostics')
var Time = require('Time')

export const toggle = (element, hide) => (element.hidden = hide)
export const hide = element => toggle(element, true)
export const show = element => toggle(element, false)

export const showMultiple = elements => elements.forEach(show)
export const hideMultiple = elements => elements.forEach(hide)

export const updateText = (element, text) => {
  element.text = text
}

export const tapRegistrar = (element, fn) => TouchGestures.onTap(element).subscribe(fn)

export const getChildren = (parent, childName, numChildren) => {
  let children = []
  for (let index = 0; index < numChildren; index++) {
    children.push(parent.child(childName + index))
  }

  return children
}

export const randomNum = (lower, upper) => Math.floor(Math.random() * upper) + lower

export const randomElement = elements => elements[randomNum(0, elements.length)]

// basic 2d box collision
export const collision = function(x1, y1, x2, y2, distanceX, distanceY) {
  var xs = x2 - x1
  var ys = y2 - y1
  xs *= xs
  ys *= ys
  return Math.hypot(x2 - x1, y2 - y1) <= distanceX
}

export const countdown = (from, to, time, everyTime, onComplete) => {
  let count = from

  const timer = () =>
    Time.setTimeout(() => {
      everyTime(count)

      if (count !== to) timer()
      else onComplete(count)
      count--
    }, time)

  return timer()
}
