var TouchGestures = require('TouchGestures')
var Diagnostics = require('Diagnostics')

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
