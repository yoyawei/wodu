// pages/user/help/help.js
Page({

  data: {
    userId: '',
    token: '',
    qas: []
  },

  onLoad: function (options) {
    //get userId & token
    try {
      this.setData({
        userId: wx.getStorageSync('userId')
      })
    } catch (e) {
      console.log(e);
    }
    try {
      this.setData({
        token: wx.getStorageSync('token')
      })
    } catch (e) {
      console.log(e);
    }
    //get helps
    wx.request({
      url: '',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-key': this.data.userId,
        'x-token': this.data.token
      },
      method: 'POST',
      data: {
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 102) {
          this.setData({
            qas: res.data.helps,
          })
        } else {
          wx.showToast({
            title: res.data.message,
            image: '/images/icons/tip.png'
          })
        }
      },
      fail: e => {
        wx.showToast({
          title: '服务器错误',
          image: '/images/icons/tip.png'
        })
      }
    })
  }
})