// pages/welcome/login/forget.js
Page({

  data: {
    isplain: true,
    isdisabled: true,
    num: ''
  },

  //get phone number
  getNum: function (e) {
    this.setData({
      num: e.detail.value
    })
  },

  checkNum: function (e) {
    var regNum = new RegExp('[0-9]{11}');
    if (!regNum.test(this.data.num)) {
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
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        phone: this.data.num
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 102) {
          wx.showToast({
            title: '发送中...',
            image: '/images/icons/loading.png'
          })
        } else if (res.data.statusCode == 0) {
          wx.showToast({
            title: '用户尚未注册',
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
  },

  //chang phone
  formSubmit: function (e) {
    console.log(e.detail.value);
    //正则式
    var regNum = new RegExp('[0-9]{11}');
    var regCode = new RegExp('[0-9]{6}');
    var regPwd = new RegExp('[0-9a-zA-Z]{6,20}');


    //验证表单合法性
    if (e.detail.value.phone.length == 0 || e.detail.value.verifycode.length == 0 || e.detail.value.password.length == 0) {
      wx.showToast({
        title: '信息不能为空',
        image: '/images/icons/tip.png'
      })
    } else if (!regPwd.test(e.detail.value.password)) {
      wx.showToast({
        title: '密码格式错误',
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
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          phone: e.detail.value.phone,
          verifycode: e.detail.value.verifycode,
          password: e.detail.value.password
        },
        success: res => {
          console.log(res.data);
          if (res.data.statusCode == 102) {
            wx.showToast({
              title: '重置成功',
              image: '/images/icons/success.png'
            })
            setTimeout(function () {
              wx.redirectTo({
                url: 'login',
              })
            }, 2000)
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