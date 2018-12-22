const AV = require('../libs/av-live-query-weapp-min')

class ShareInfo extends AV.Object {
  get ownerId() {
    return this.get('ownerId')
  }

  set ownerId(ownerId) {
    this.set('ownerId', ownerId)
  }

  get currentUserId() {
    return this.get('currentUserId')
  }

  set currentUserId(currentUserId) {
    this.set('currentUserId', currentUserId)
  }

  get location() {
    return this.get('location')
  }

  set location(location) {
    this.set('location', location)
  }

  get currentVehicleNumber() {
    return this.get('currentVehicleNumber')
  }

  set currentVehicleNumber(currentVehicleNumber) {
    this.set('currentVehicleNumber', currentVehicleNumber)
  }

  get startDate() {
    return this.get('startDate')
  }

  set startDate(startDate) {
    this.set('startDate', startDate)
  }

  get endDate() {
    return this.get('endDate')
  }

  set endDate(endDate) {
    this.set('endDate', endDate)
  }

  get comment() {
    return this.get('comment')
  }

  set comment(comment) {
    this.set('comment', comment)
  }
}
AV.Object.register(ShareInfo, 'ShareInfo');

export default ShareInfo