import CartportInfo from '../models/carportInfo'
import ShareInfo from '../models/shareInfo'
import AV from '../libs/av-live-query-weapp-min'
import util from './util'

export const fetchCurrentCarportList = (ownerId, successCb, failedCb) => {
  // query carport first
  const query = new AV.Query(CartportInfo)
    .equalTo('ownerId', ownerId)

  // function in then() should bind this object or using this.methodName
  return query.find().then(successCb).catch(failedCb)
}


export const fetchShareInfoListByOwnerId = (ownerId, successCb, failedCb) => {
  const query = new AV.Query(ShareInfo).greaterThanOrEqualTo('startDate', util.getDateTime(new Date())) // start one day from 00:00:00
    .equalTo('ownerId', ownerId).addAscending('createdAt');

  // function in then() should bind this object or using this.methodName
  return query.find().then(successCb).catch(failedCb)
}

export const fetchShareInfoListByCurrentUserId = (currentUserId, successCb, failedCb) => {
  const query = new AV.Query(ShareInfo).greaterThanOrEqualTo('startDate', util.getDateTime(new Date())) // start one day from 00:00:00
    .equalTo('currentUserId', currentUserId).addAscending('createdAt');

  // function in then() should bind this object or using this.methodName
  return query.find().then(successCb).catch(failedCb)
}

export const fetchAllShareInfo = (successCb, failedCb, createDate, excludeOwnerId) => {
  let query = new AV.Query(ShareInfo).greaterThanOrEqualTo('startDate', util.getDateTime(new Date()))
  if (excludeOwnerId){
    query = query.notEqualTo('ownerId', excludeOwnerId)
  }
  if(createDate){
    query = query.greaterThanOrEqualTo('createdAt', util.getDateTime(createDate))
  }

  return query.find().then(successCb).catch(failedCb)
}

export const errorCallback = error => {
  console.error(error)
}