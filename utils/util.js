const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const getDateTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return new Date(`${year}/${month}/${day}`)
}

const getDateHourTimeOrString = (date, type = 'date') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()

  if (type === 'date') {
    return new Date(`${year}/${month}/${day} ${hour}:${minute}`)
  } else {
    return `${year}/${month}/${day} ${hour}:${minute}`
  }
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

const isValidateVechileNumber = vehicleNumber => {
  let result = false;
  if (vehicleNumber.length === 7) {
    const express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
    result = express.test(vehicleNumber);
  }
  return result;
}

const isEmptyString = string => {
  return string !== ''
}

const isValidatePhoneNumber = phoneNumber => {
  let result = false
  if(phoneNumber.length === 11){
    const express = /^1[34578]\d{9}$/
    result = express.test(phoneNumber)
  }
  return result
}

module.exports = {
  formatTime: formatTime,
  getDateTime: getDateTime,
  getDateHourTimeOrString: getDateHourTimeOrString,
  isApiResponseOk: isApiResponseOk,
  isValidateVechileNumber: isValidateVechileNumber,
  isEmptyString: isEmptyString,
  isValidatePhoneNumber: isValidatePhoneNumber,
}