// pages/user/info/editphone.js
Page({

  data: {
    userId: '',
    token: '',
    isplain: true,
    isdisabled: true,
    num: '',
    old: ''
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
    //getUserInfo
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
        if (res.data.statusCode == 100) {
          this.setData({
            old: res.data.result.phone
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
  },

  //get phone number
  getNum: function (e) {
    this.setData({
      num: e.detail.value
    })
  },

  checkNum: function (e) {
    var regNum = new RegExp('[0-9]{11}');
    if (this.data.num == this.data.old) {
      wx.showToast({
        title: '账号不变',
        image: '/images/icons/tip.png'
      })
    } else if (!regNum.test(this.data.num)) {
      wx.showToast({
        title: '手机号错误',
        image: '/images/icons/tip.png'
      })
    } else {
      this.setData({
        isplain: false,
        isdisabled: false
      })
    }
  },

  getCode: function (e) {
    this.setData({
      isplain: true,
      isdisabled: true
    })
    //getVerifycode
    wx.request({
      url: '',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-key': this.data.userId,
        'x-token': this.data.token
      },
      method: 'POST',
      data: {
        phone: this.data.num,
        type: 1
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == -200) {
          wx.showToast({
            title: '登录失效',
            image: '/images/icons/tip.png'
          })
        } else if (res.data.statusCode == 100) {
          wx.showToast({
            title: '发送中...',
            image: '/images/icons/loading.png'
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
  },

  //chang phone
  formSubmit: function (e) {
    console.log(e.detail.value);
    //正则式
    var regNum = new RegExp('[0-9]{11}');
    var regCode = new RegExp('[0-9]{6}');

    //验证表单合法性
    if (e.detail.value.phone.length == 0 || e.detail.value.verifycode.length == 0) {
      wx.showToast({
        title: '信息不能为空',
        image: '/images/icons/tip.png'
      })
    } else if (!regNum.test(e.detail.value.phone) || !regCode.test(e.detail.value.verifycode)) {
      wx.showToast({
        title: '信息格式错误',
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
          phone: e.detail.value.phone,
          verifycode: e.detail.value.verifycode
        },
        success: res => {
          console.log(res.data);
          if (res.data.statusCode == 100) {
            wx.showToast({
              title: '修改成功',
              image: '/images/icons/success.png'
            })
            try {
              wx.removeStorageSync('userId')
            } catch (e) {
            }
            try {
              wx.removeStorageSync('token')
            } catch (e) {
            }
            setTimeout(function () {
              wx.navigateBack({
                delta: 2
              })
              wx.redirectTo({
                url: '../../welcome/welcome',
              })
            }, 1500)
          } else if (res.data.statusCode == 0) {
            wx.showToast({
              title: '验证码错误',
              image: '/images/icons/tip.png'
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
  }
})