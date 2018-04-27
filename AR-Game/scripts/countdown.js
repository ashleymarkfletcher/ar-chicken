var Time = require('Time')
var Diagnostics = require('Diagnostics')

const countdown = (from, to, time, everyTime, onComplete) => {
  let count = from

  const timer = () =>
    Time.setTimeout(() => {
      everyTime(count)

      if (count !== to) timer()
      else onComplete(count)

      count--
    }, time)

  timer()
}

export default countdown
