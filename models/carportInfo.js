const AV = require('../libs/av-live-query-weapp-min')

class CarportInfo extends AV.Object {
  get ownerId() {
    return this.get('ownerId')
  }

  set ownerId(ownerId) {
    this.set('ownerId', ownerId)
  }

  get location() {
    return this.get('location')
  }

  set location(location) {
    this.set('location', location)
  }

  get vehicleNumber() {
    return this.get('vehicleNumber')
  }

  set vehicleNumber(vehicleNumber) {
    this.set('vehicleNumber', vehicleNumber)
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
AV.Object.register(CarportInfo);

export default CarportInfo