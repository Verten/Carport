// pages/list/list.js
import AV from '../../libs/av-live-query-weapp-min'
import ShareInfo from '../../models/shareInfo'
import * as apiUtil from '../../utils/apiUtil'
import util from '../../utils/util'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogShow: false,
    carportsInfo: [],
    shareInfoList: [],
    lastShareInfoCreateDate: null,
    actions: [{
      name: '预定'
    }, ]
  },

  getCarportsInfo: function(carports) {
    const carportsInfo = carports.map(carport => {
      return {
        carportId: carport.get('objectId'),
        vehicleNumber: carport.get('vehicleNumber'),
        location: carport.get('location'),
        startDate: null,
        endDate: null,
      }
    })
    this.setData({
      carportsInfo,
    })
  },

  getAllShareInfoList: function(_shareInfoList) {
    const shareInfoList = _shareInfoList.map(_shareInfo => {
      const shareInfo = _shareInfo.toJSON()
      return {
        ...shareInfo,
        currentVehicleNumber: shareInfo.currentVehicleNumber.replace(/[A-Z]\d{2}/, '***'),
        startDate: new Date(shareInfo.startDate).nv_toLocaleDateString(),
        endDate: new Date(shareInfo.endDate).nv_toLocaleDateString(),
      }
    })
    if (shareInfoList.length !== 0) {
      this.setData({
        shareInfoList,
        lastShareInfoCreateDate: shareInfoList.length !== 0 && shareInfoList[shareInfoList.length - 1].createdAt,
      })
    }
    wx.hideLoading()
  },

  showShareInfo: function(e) {
    const selectedShareInfoId = e.target.dataset.shareinfoid
    this.setData({
      selectedShareInfoId,
      dialogShow: true,
    })
  },

  onSelectShareInfo: function() {
    console.info(this.data.selectedShareInfoId)
    wx.showLoading({
      title: '预定中',
    });
    // get first carport information
    const vehicleNumber = this.data.carportsInfo[0].vehicleNumber
    const selectedShareInfo = AV.Object.createWithoutData('ShareInfo', this.data.selectedShareInfoId)
    selectedShareInfo.currentVehicleNumber = vehicleNumber
    selectedShareInfo.currentUserId = app.globalData.user.objectId
    // update shareInfo
    selectedShareInfo.save().then(function(result) {
      wx.hideLoading()
      wx.showToast({
        title: '预定成功',
      })
      this.setData({
        dialogShow: false,
      })
      apiUtil.fetchAllShareInfo(this.getAllShareInfoList, apiUtil.errorCallback, new Date(), app.globalData.user.objectId) //
    }.bind(this)).catch(function(error) {
      console.info(error)
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: '预定成功',
      })
    })
  },

  onCloseDialog: function() {
    this.setData({
      dialogShow: false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.info('list page load')
    if (app.globalData.user.objectId) {
      wx.showLoading({
        title: '读取中',
      });
      apiUtil.fetchAllShareInfo(this.getAllShareInfoList, apiUtil.errorCallback, new Date(), app.globalData.user.objectId)
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
    if (app.globalData.user) {
      apiUtil.fetchCurrentCarportList(app.globalData.user.objectId, this.getCarportsInfo, apiUtil.errorCallback)
    }
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
    console.info('list page onReachBottom')
    if (app.globalData.user.objectId) {
      wx.showLoading({
        title: '读取中',
      });
      apiUtil.fetchAllShareInfo(this.getAllShareInfoList, apiUtil.errorCallback, new Date(this.data.lastShareInfoCreateDate), app.globalData.user.objectId)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})