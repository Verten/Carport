//index.js
import Toast from 'vant-weapp/toast/toast'
import CartportInfo from '../../models/carportInfo'
import * as apiUtil from '../../utils/apiUtil'
const util = require('../../utils/util.js')
const AV = require('../../libs/av-live-query-weapp-min');

//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    leanUserInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../home/home'
    })
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (res, leanUserInfo) => {
        this.setData({
          leanUserInfo,
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        if (leanUserInfo) {
          apiUtil.fetchCurrentCarportList(leanUserInfo.objectId, this.getVechileNumber, apiUtil.errorCallback)
        }
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /**
   * get vechile number to userInfo
   */
  getVechileNumber: function(carports) {
    const carportsInfo = carports.map(carport => {
      return {
        vehicleNumber: carport.get('vehicleNumber'),
        location: carport.get('location'),
      }
    })
    Object.assign(this.data.userInfo, {
      carportsInfo,
    })
    this.setData({
      userInfo: this.data.userInfo,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.info('home page show')
    if (this.data.leanUserInfo.objectId) {
      apiUtil.fetchCurrentCarportList(this.data.leanUserInfo.objectId, this.getVechileNumber, apiUtil.errorCallback)
    }
  },

  getUserInfo: function(e) {
    console.log(e)
    if (!util.isApiResponseOk('getUserInfo', e.detail.errMsg)) {
      this.setData({
        userInfo: {},
        hasUserInfo: false
      })
    } else {
      wx.showLoading({
        title: '数据加载中',
      });
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      AV.User.loginWithWeapp().then(user => {
        app.globalData.user = user.toJSON();
        wx.hideLoading()
      }).catch(console.error);
    }
  },
  redirectToShare: function() {
    // user should have to set carport information first
    if (!this.iskUserHasVehicle()) {
      return false
    } else {
      wx.navigateTo({
        url: '../share/share'
      })
    }
  },
  redirectToHistory: function() {
    // user should have to set carport information first
    if (!this.iskUserHasVehicle()) {
      return false
    } else {
      wx.navigateTo({
        url: '../history/history'
      })
    }
  },
  redirectToList: function() {
    if (!this.iskUserHasVehicle()) {
      return false
    } else {
      wx.navigateTo({
        url: '../list/list'
      })
    }
  },
  redirectToSetting: function() {
    wx.navigateTo({
      url: '../setting/setting'
    })
  },
  iskUserHasVehicle: function() {
    if (!this.data.userInfo.carportsInfo || this.data.userInfo.carportsInfo.length === 0) {
      Toast.fail({
        message: '请先设置信息',
        duration: 1500,
      })
      return false
    }
    return true
  },
})