import CartportInfo from '../models/carportInfo'
import AV from '../libs/av-live-query-weapp-min'

export const fetchCurrentCarportList = (ownerId, successCb, failedCb) => {
  // query carport first
  const query = new AV.Query(CartportInfo)
    .equalTo('ownerId', ownerId)

  // function in then() should bind this object or using this.methodName
  return query.find().then(successCb).catch(failedCb)
}


export const errorCallback = error => {
  console.error(error)
}