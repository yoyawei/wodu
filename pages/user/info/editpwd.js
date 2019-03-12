// pages/user/info/editpwd.js
Page({

  data: {
    userId: '',
    token: '',
    college: ''
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
  },

  formSubmit: function (e) {
    console.log(e.detail.value);
    var regPwd = new RegExp('[0-9a-zA-Z]{6,20}');

	//验证表单合法性
    if (e.detail.value.password.length == 0 || e.detail.value.repwd.length == 0) {
      wx.showToast({
        title: '信息不能为空',
        image: '/images/icons/tip.png'
      })
    } else if (!regPwd.test(e.detail.value.password)) {
      wx.showToast({
        title: '密码格式错误',
        image: '/images/icons/tip.png'
      })
    } else if (e.detail.value.password != e.detail.value.repwd){
      wx.showToast({
        title: '密码不同',
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
          password: e.detail.value.password
        },
        success: res => {
          console.log(res.data);
          if (res.data.statusCode == 102) { 
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
          } else {
            wx.showToast({
              title: res.data.message,
              image: '/images/icons/tip.png'
            })
          }
        },
        fail: e => {
          wx.showToast({
            title: '错误...',
            image: '/images/icons/tip.png'
          })
        }
      })
    }
  }
})