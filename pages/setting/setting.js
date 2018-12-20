// pages/setting/setting.js
import CartportInfo from '../../models/carportInfo'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    vechileNumber: '',
    carportLocation: '',
  },
  /**
   * customize function
   */
  onUsernameChange: function(event) {
    this.setData({
      username: event.detail,
    })
  },
  onVechileNumberChange: function(event){
    this.setData({
      vechileNumber: event.detail,
    })
  },
  onCarportLocationChange: function(event){
    this.setData({
      carportLocation: event.detail,
    })
  },
  handleChangeUserinfo: function(){
    const carportInfo = new CartportInfo()
    carportInfo.ownerId = app.globalData.user.objectId
    carportInfo.location = this.data.carportLocation
    carportInfo.vehicleNumber = this.data.vechileNumber
    console.info(carportInfo)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.user){
      this.setData({
        username: app.globalData.user.username,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})