// pages/history/history.js
import ShareInfo from '../../models/shareInfo'
import AV from '../../libs/av-live-query-weapp-min'
import * as apiUtil from '../../utils/apiUtil'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myShareInfoList: [],
    bookedShareInfoList: []
  },

  getMyShareInfo: function(shareInfoList) {
    const myShareInfoList = shareInfoList.map(_shareInfo => {
      const shareInfo = _shareInfo.toJSON()
      return {
        ...shareInfo,
        currentVehicleNumber: shareInfo.currentVehicleNumber.replace(/[A-Z]\d{2}/, '***'),
        startDate: new Date(shareInfo.startDate).nv_toLocaleDateString(),
        endDate: new Date(shareInfo.endDate).nv_toLocaleDateString(),
      }
    })
    this.setData({
      myShareInfoList,
    })
    wx.hideLoading()
  },

  getMyBookInfo: function(myBookInfoList) {
    const bookedShareInfoList = myBookInfoList.map(_bookedShareInfo => {
      const bookedShareInfo = _bookedShareInfo.toJSON()
      return {
        ...bookedShareInfo,
        currentVehicleNumber: bookedShareInfo.currentVehicleNumber.replace(/[A-Z]\d{2}/, '***'),
        startDate: new Date(bookedShareInfo.startDate).nv_toLocaleDateString(),
        endDate: new Date(bookedShareInfo.endDate).nv_toLocaleDateString(),
      }
    })
    this.setData({
      bookedShareInfoList,
    })
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.info('history page load', app.globalData.user)
    wx.showLoading({
      title: '读取中',
    });
    const ownerId = app.globalData.user.objectId
    if (ownerId) {
      apiUtil.fetchShareInfoListByOwnerId(ownerId, this.getMyShareInfo, apiUtil.errorCallback)
      apiUtil.fetchShareInfoListByCurrentUserId(ownerId, this.getMyBookInfo, apiUtil.errorCallback)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})