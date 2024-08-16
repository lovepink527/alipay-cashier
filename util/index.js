export const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('-') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

/**
 * 防抖
 * @param fn 需要防抖的函数
 * @param t 时间
 */
// export const debounce = (fn, t = 300) => {
//   let timeId = null
//   const delay = t
//   return function (this, ...args) {
//     if (timeId) {
//       clearTimeout(timeId)
//     }
//     timeId = setTimeout(() => {
//       timeId = null
//       fn.apply(this, args)
//     }, delay)
//   }
// }

/**
 * 节流
 * @param fn 需要节流的函数
 * @param t 时间
 */
// export const throttle = (fn, t) => {
//   let flag = true
//   const interval = t
//   return function (this, ...args) {
//     if (flag) {
//       fn.apply(this, args)
//       flag = false
//       setTimeout(() => {
//         flag = true
//       }, interval)
//     }
//   }
// }

