// pages/history/history.js
import ShareInfo from '../../models/shareInfo'
import AV from '../../libs/av-live-query-weapp-min'
import Dialog from 'vant-weapp/dialog/dialog';
import * as apiUtil from '../../utils/apiUtil'
import util from '../../utils/util'

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
      const myShareInfo = {
        ...shareInfo,
        currentVehicleNumber: shareInfo.currentVehicleNumber.replace(/[A-Z]\d{2}/, '***'),
        startDate: util.getDateHourTimeOrString(new Date(shareInfo.startDate), 'string'),
        endDate: util.getDateHourTimeOrString(new Date(shareInfo.endDate), 'string'),
      }
      if (shareInfo.currentUserId) {
        apiUtil.fetchUserByUserId(shareInfo.currentUserId, user => this.getBookedUser(shareInfo.currentUserId, user), apiUtil.errorCallback)
      }
      return myShareInfo
    })
    this.setData({
      myShareInfoList,
    })
    wx.hideLoading()
  },

  getMyBookInfo: function(myBookInfoList) {
    const bookedShareInfoList = myBookInfoList.map(_bookedShareInfo => {
      const bookedShareInfo = _bookedShareInfo.toJSON()
      const myBookedInfo = {
        ...bookedShareInfo,
        currentVehicleNumber: bookedShareInfo.currentVehicleNumber.replace(/[A-Z]\d{2}/, '***'),
        startDate: util.getDateHourTimeOrString(new Date(bookedShareInfo.startDate), 'string'),
        endDate: util.getDateHourTimeOrString(new Date(bookedShareInfo.endDate), 'string'),
      }
      if (bookedShareInfo.ownerId) {
        apiUtil.fetchUserByUserId(bookedShareInfo.ownerId, user => this.getOwnerdUser(bookedShareInfo.ownerId, user), apiUtil.errorCallback)
      }
      return myBookedInfo
    })
    this.setData({
      bookedShareInfoList,
    })
    wx.hideLoading()
  },

  getBookedUser: function(bookedUserId, bookedUser) {
    this.data.myShareInfoList.forEach(shareInfo => {
      if (shareInfo.currentUserId === bookedUserId) {
        Object.assign(shareInfo, {
          currentUser: bookedUser.toJSON(),
        })
      }
    })
    this.setData({
      myShareInfoList: this.data.myShareInfoList,
    })
  },

  getOwnerdUser: function (ownerUserId, ownerUser) {
    this.data.bookedShareInfoList.forEach(shareInfo => {
      if (shareInfo.ownerId === ownerUserId) {
        Object.assign(shareInfo, {
          ownerUser: ownerUser.toJSON(),
        })
      }
    })
    this.setData({
      bookedShareInfoList: this.data.bookedShareInfoList,
    })
  },

  showBookedUserInfo: function(e) {
    const selectedShareInfoId = e.target.dataset.shareinfoid
    this.data.myShareInfoList.forEach(shareInfo => {
      if (shareInfo.objectId === selectedShareInfoId) {
        let message = '该用户没设置手机号码'
        if (shareInfo.currentUser) {
          if (shareInfo.currentUser.phoneNumber) {
            message = `姓名: ${shareInfo.currentUser.username} \n 联系方式: ${shareInfo.currentUser.phoneNumber}`
          }
          Dialog.alert({
            title: '车主联系方式',
            message,
          }).then(() => {
            console.info('dialog close')
          });
        }
      }
    })
  },

  showOwnerUserInfo: function(e) {
    const selectedShareInfoId = e.target.dataset.shareinfoid
    console.info(selectedShareInfoId)
    this.data.bookedShareInfoList.forEach(shareInfo => {
      if (shareInfo.objectId === selectedShareInfoId) {
        let message = '该用户没设置手机号码'
        if (shareInfo.ownerUser) {
          if (shareInfo.ownerUser.phoneNumber) {
            message = `姓名: ${shareInfo.ownerUser.username} \n 联系方式: ${shareInfo.ownerUser.phoneNumber}`
          }
          Dialog.alert({
            title: '车位联系人方式',
            message,
          }).then(() => {
            console.info('dialog close')
          });
        }
      }
    })
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