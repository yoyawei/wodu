const app = getApp()

Page({

  data: {
    login: false,
    load: true,
    nickName: '',
    avatarUrl: ''
  },

  onLoad: function () {
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

    if (this.data.userId != '' || this.data.token != '') {
      this.setData({
        login: true
      })
    }

    //get Info
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
        type: 0
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == -200) {
          this.setData({
            login: false
          })
          wx.showToast({
            title: '登录失效',
            image: '/images/icons/tip.png'
          })
        } else if (res.data.statusCode == 100) {
          this.setData({
            nickName: res.data.result.nickName,
            avatarUrl: res.data.result.pictureUrl
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
    this.setData({
      load: false
    })
  },

  //限制登录用户
  oninfoTap: function (event) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: "info/info"
      })
    }
  },
  onstatusTap: function (event) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: "status/status"
      })
    }
  },
  onfollowTap: function (event) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: "follow/follow"
      })
    }
  },
  onsharedTap: function (event) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: "shared/shared"
      })
    }
  },
  onhistoryTap: function (event) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: "history/history"
      })
    }
  },
  onhelpTap: function (event) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: 'help/help',
      })
    }
  },
  onfeedbackTap: function (event) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: 'feedback/feedback',
      })
    }
  },

  //不限制
  toWel: function () {
    wx.redirectTo({
      url: '../welcome/welcome',
    })
  }

})