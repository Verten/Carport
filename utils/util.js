const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const isApiResponseOk = (apiName, responseMessage) => {
  if (responseMessage) {
    const message = responseMessage.split(':')
    if (message[0] === apiName) {
      return message[1] === 'ok'
    }
  }
  return false
}

module.exports = {
  formatTime: formatTime,
  isApiResponseOk: isApiResponseOk,
}