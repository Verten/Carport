const AV = require('./libs/av-live-query-weapp-min');

AV.init({
  appId: '455NQFwgxVebEKXiu8feLr1t-gzGzoHsz',
  appKey: '2oL3oEQbFuAqf2msAM01NwA2',
});
//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     console.info(res)
    //   }
    // })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.showLoading({
            title: '数据加载中',
          });
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              AV.User.loginWithWeapp().then(user => {
                this.globalData.user = user.toJSON();
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res, this.globalData.user)
                }
                wx.hideLoading()
              }).catch(console.error);
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