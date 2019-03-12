// pages/home/activity/wish/wish.js
Page({

  data: {
    userId: '',
    token: ''
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
    if(this.data.userId=='' || this.data.token==''){
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
      setTimeout(function () {
        wx.switchTab({
          url: '/pages/home/home',
        })
      },1500)
    }
  },

  //wish
  formSubmit: function (e) {
    //console.log(e.detail.value);
    //验证表单合法性
    if (e.detail.value.bookName.length == 0 || e.detail.value.author.length == 0 || e.detail.value.pubHouse.length == 0 || e.detail.value.reason.length == 0) {
      wx.showToast({
        title: '信息不能为空',
        image: '/images/icons/tip.png'
      })
    } else {
      //提交表单信息 
      wx.request({
        url: '',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-key': this.data.userId,
          'x-token': this.data.token
        },
        method: 'POST',
        data: {
          userId: this.data.userId,
          bookName: e.detail.value.bookName,
          author: e.detail.value.author,
          pubHouse: e.detail.value.pubHouse,
          wishDetail: e.detail.value.reason
        },
        success: res => {
          console.log(res.data);
          if (res.data.statusCode == -200) {
            wx.showToast({
              title: '请先登录',
              image: '/images/icons/tip.png'
            })
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/home/home',
              })
            }, 1000)
          } else if (res.data.statusCode == 102) {
            wx.showToast({
              title: '提交成功',
              image: '/images/icons/success.png'
            })
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/home/home',
              })
            }, 2000)
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
  }
})