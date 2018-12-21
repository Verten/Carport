// pages/setting/setting.js
import CartportInfo from '../../models/carportInfo'
import AV from '../../libs/av-live-query-weapp-min'
import * as apiUtil from '../../utils/apiUtil'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carportList: [],
    username: {
      value: '',
      error: '',
    },
    vechileNumber: {
      value: '',
      error: '',
    },
    carportLocation: {
      value: '',
      error: '',
    },
  },
  /**
   * customize function
   */
  onUsernameChange: function(event) {
    Object.assign(this.data.username, {
      value: event.detail,
      error: ''
    })
    this.setData({
      username: this.data.username,
    })
  },
  onVechileNumberChange: function(event) {
    Object.assign(this.data.vechileNumber, {
      value: event.detail,
      error: ''
    })
    this.setData({
      vechileNumber: this.data.vechileNumber,
    })
  },
  onCarportLocationChange: function(event) {
    Object.assign(this.data.carportLocation, {
      value: event.detail,
      error: ''
    })
    this.setData({
      carportLocation: this.data.carportLocation,
    })
  },
  handleChangeUserinfo: function() {
    // validate user input
    if (!this.isValidateVechileNumber(this.data.vechileNumber.value)) {
      Object.assign(this.data.vechileNumber, {
        error: true
      })
      wx.showToast({
        icon: 'none',
        title: '请检查车牌号',
        mask: true,
      })
      this.setData({
        vechileNumber: this.data.vechileNumber,
      })
      return false
    }

    if (!this.isValidateUserName(this.data.username.value)) {
      Object.assign(this.data.username, {
        error: true
      })
      wx.showToast({
        icon: 'none',
        title: '请检查用户名',
        mask: true,
      })
      this.setData({
        username: this.data.username,
      })
      return false
    }

    wx.showLoading({
      title: '保存中',
    });

    let carportInfo = null

    // init carport information, cuerrent only allow one user with one carport
    if (this.data.carportList.length === 0) {
      carportInfo = new CartportInfo()
    } else {
      carportInfo = this.data.carportList[0]
    }
    carportInfo.ownerId = app.globalData.user.objectId
    carportInfo.location = this.data.carportLocation.value
    carportInfo.vehicleNumber = this.data.vechileNumber.value
    console.info('Carport information -> ', carportInfo)

    // get current user information
    const currentUser = AV.User.current();
    // set username
    currentUser.setUsername(this.data.username.value)

    currentUser.save().then(function(user) {
      console.info('save user success -> ', user)
      // save carport after save user success
      return carportInfo.save()
    }).then(function(carport) {
      console.info('save carport success -> ', carport)
      wx.hideLoading()
      wx.showToast({
        title: '更新成功',
        duration: 2000,
      })
      wx.navigateBack({
        delta: 1,
      })
    }).catch(function(error) {
      console.info('save object error -> ', error)
      wx.hideLoading()
    })
  },

  isValidateUserName: function(username) {
    return username !== ''
  },

  isValidateVechileNumber: function(vehicleNumber) {
    var result = false;
    if (vehicleNumber.length == 7) {
      var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
      result = express.test(vehicleNumber);
    }
    return result;
  },

  updateCarportInfo: function(carports) {
    console.info('current carports: ', carports)
    this.setData({
      carportList: carports,
      vechileNumber: {
        value: carports[0].get('vehicleNumber'),
        error: '',
      },
      carportLocation: {
        value: carports[0].get('location'),
        error: '',
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.setData({
        username: {
          value: app.globalData.userInfo.nickName,
          error: '',
        },
      })
    }
    apiUtil.fetchCurrentCarportList(app.globalData.user.objectId, this.updateCarportInfo, apiUtil.errorCallback)
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