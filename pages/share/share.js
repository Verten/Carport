// pages/share/share.js
import * as apiUtil from '../../utils/apiUtil'
import util from '../../utils/util'
import ShareInfo from '../../models/shareInfo'
import AV from '../../libs/av-live-query-weapp-min'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carportsInfo: [],
    myShareInfoList: [],
    currentCarportId: '',
    datePickerShow: false,
    currentDate: new Date().getTime(),
    minDate: new Date().getTime()
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

  getMyShareInfo: function(shareInfoList) {
    const myShareInfoList = shareInfoList.map(_shareInfo => {
      const shareInfo = _shareInfo.toJSON()
      return {
        ...shareInfo,
        currentVehicleNumber: shareInfo.currentVehicleNumber.replace(/[A-Z]\d{2}/, '***'),
        startDate: util.getDateHourTimeOrString(new Date(shareInfo.startDate), 'string'),
        endDate: util.getDateHourTimeOrString(new Date(shareInfo.endDate), 'string'),
      }
    })
    this.setData({
      myShareInfoList,
    })
    wx.hideLoading()
  },

  showDatePicker: function(e) {
    this.setData({
      currentCarportId: e.target.id,
      datePickerShow: true,
      datePickerProperty: e.target.dataset.name,
    })
  },

  onDateCancel() {
    this.setData({
      datePickerShow: false,
    });
  },

  onDateConfirm(event) {
    this.data.carportsInfo.forEach(carportInfo => {
      if (carportInfo.carportId === this.data.currentCarportId) {
        carportInfo[this.data.datePickerProperty] = util.getDateHourTimeOrString(new Date(event.detail), 'string')
      }
    })
    this.setData({
      carportsInfo: this.data.carportsInfo,
      datePickerShow: false,
    });
  },

  handleSubmitShareinfo: function() {
    let allFinish = true
    let allValidate = false
    const dataValidateInformation = []
    this.data.carportsInfo.forEach(carportInfo => {
      if (!carportInfo.startDate || !carportInfo.endDate) {
        wx.showToast({
          icon: 'none',
          title: '请完善信息',
          mask: true,
        })
        allFinish = false
      } else if (new Date(carportInfo.startDate).getTime() > new Date(carportInfo.endDate).getTime()) {
        wx.showToast({
          icon: 'none',
          title: '结束时间需大于开始时间',
          mask: true,
        })
        allFinish = false
      }
    })

    this.data.carportsInfo.forEach(carportInfo => {
      this.data.myShareInfoList.forEach(shareInfo => {
        let _valid = false
        if (new Date(carportInfo.startDate).getTime() > new Date(shareInfo.endDate).getTime() || new Date(carportInfo.endDate).getTime() < new Date(shareInfo.startDate).getTime()) {
          _valid = true
        }
        dataValidateInformation.push(_valid)
      })
    })

    if (dataValidateInformation.includes(false)) {
      wx.showToast({
        icon: 'none',
        title: '该时间段车位已经共享',
        mask: true,
      })
      allValidate = false
    }else{
      allValidate = true
    }

    if (allFinish && allValidate) {
      wx.showLoading({
        title: '保存中',
      });

      const shareInfoList = this.data.carportsInfo.map(carport => {
        const shareInfo = new ShareInfo()
        shareInfo.ownerId = app.globalData.user.objectId
        shareInfo.currentUserId = ''
        shareInfo.currentVehicleNumber = ''
        shareInfo.location = carport.location
        shareInfo.startDate = new Date(carport.startDate)
        shareInfo.endDate = new Date(carport.endDate)
        return shareInfo
      })

      console.info(shareInfoList)

      AV.Object.saveAll(shareInfoList, {
        fetchWhenSave: true,
      }).then(function(result) {
        console.info(result)
        this.getMyShareInfo(result)
        wx.showToast({
          title: '保存成功',
          mask: true,
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: 1,
          })
        }, 1500)
      }.bind(this)).catch(function(error) {
        console.info('save shareInfo list error -> ', error)
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '保存失败',
          mask: true,
        })
      })

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    console.info('share page show', app.globalData)
    if (app.globalData.user) {
      wx.showLoading({
        title: '读取中',
      });
      const ownerId = app.globalData.user.objectId
      apiUtil.fetchShareInfoListByOwnerId(ownerId, this.getMyShareInfo, apiUtil.errorCallback)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})