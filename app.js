//app.js
App({
  data: {
    userId: '',
    token: ''
  },
  globalData: {
    userInfo: null
  },
  onLaunch: function () {
    //微信登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
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
            }
          })
        }
      }
    })
  },

  timestampToTime(timestamp) {
    var myData = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = myData.getFullYear() + '/';
    var M = (myData.getMonth() + 1 < 10 ? '0' + (myData.getMonth() + 1) : myData.getMonth() + 1) + '/';
    var D = (myData.getDate() < 10 ? ('0' + myData.getDate()) : myData.getDate()) + ' ';
    var h = (myData.getHours() < 10 ? ('0' + myData.getHours()) : myData.getHours()) + ':';
    var m = (myData.getMinutes() < 10 ? ('0' + myData.getMinutes()) : myData.getMinutes()) + ':';
    var s = (myData.getSeconds() < 10 ? ('0' + myData.getSeconds()) : myData.getSeconds());

    return Y + M + D + h + m + s;
  },
})