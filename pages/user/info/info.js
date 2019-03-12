// pages/user/info/info.js
const app = getApp()

Page({

  data: {
    load: true,
    userId: '',
    token: '',
    name: '',
    stuNum: '',
    phone: '',
    college: '',
    nickname: '',
    sex: '',
    registerTime: '',
    loginTime: ''
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

    //get getUserInfo
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
          wx.showToast({
            title: '登录失效',
            image: '/images/icons/tip.png'
          })
        } else if (res.data.statusCode == 100) {
          var rsex;
          var dr = app.timestampToTime(res.data.result.registerTime);
          var dl = app.timestampToTime(res.data.result.loginTime);
          if (res.data.result.sex) {
            rsex = '女';
          } else {
            rsex = '男';
          }
          this.setData({
            name: res.data.result.name,
            stuNum: res.data.result.stuNum,
            phone: res.data.result.phone,
            nickname: res.data.result.nickName,
            college: res.data.result.college,
            sex: rsex,
            registerTime: dr,
            loginTime: dl
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
  toEdit: function (e) {
    var temp = e.currentTarget.dataset.index;
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: "editinfo"
      })
    }
  },

  tophoneTap: function (e) {
    var temp = e.currentTarget.dataset.index;
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: 'editphone',
      })
    }
  },

  topwdTap: function (e) {
    var temp = e.currentTarget.dataset.index;
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: 'editpwd',
      })
    }
  },

  logout: function (e) {
    var temp = e.currentTarget.dataset.index;
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.request({
        url: '',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-key': this.data.userId,
          'x-token': this.data.token
        },
        method: 'POST',
        data: {
          userId: this.data.userId
        },
        success: res => {
          console.log(res.data);
          if (res.data.statusCode == 102) {
            try {
              wx.removeStorageSync('userId')
            } catch (e) {
            }
            try {
              wx.removeStorageSync('token')
            } catch (e) {
            }
            wx.showToast({
              title: '退出成功',
              image: '/images/icons/success.png'
            })
            setTimeout(function () {
              // wx.navigateBack({
              //   delta: 1
              // })
              // wx.redirectTo({
              //   url: '../../welcome/welcome',
              // })
              wx.reLaunch({
                url: '../../welcome/welcome'
              })
            }, 1500)
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
  }
}) 