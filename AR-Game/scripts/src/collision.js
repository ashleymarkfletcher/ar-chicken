// basic 2d box collision
const collision = function(x1, y1, x2, y2, distanceX, distanceY) {
  var xs = x2 - x1
  var ys = y2 - y1
  xs *= xs
  ys *= ys
  return Math.hypot(x2 - x1, y2 - y1) <= distanceX
}

export default collision
