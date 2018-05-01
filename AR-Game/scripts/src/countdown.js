var Time = require('Time')

const countdown = (from, to, time, everyTime, onComplete) => {
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

export default countdown
