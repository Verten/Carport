const AV = require('./libs/av-live-query-weapp-min');

AV.init({
  appId: '455NQFwgxVebEKXiu8feLr1t-gzGzoHsz',
  appKey: '2oL3oEQbFuAqf2msAM01NwA2',
});
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    wx.showLoading({
      title: '数据加载中',
    });

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     console.info(res)
    //   }
    // })

    AV.User.loginWithWeapp().then(user => {
      this.globalData.user = user.toJSON();
      wx.navigateTo({
        url: '../home/home'
      })
      wx.hideLoading()
    }).catch(console.error);

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              wx.navigateTo({
                url: '../home/home'
              })
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    user: null,
  }
})