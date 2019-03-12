// pages/user/info/editinfo.js
Page({

  data: {
    userId: '',
    token: '',
    college: '',
    nickname: '',
    sex: ''
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
            college: res.data.result.college,
            nickname: res.data.result.nickName
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

  formSubmit: function (e) {
    console.log(e.detail.value);
    //验证表单合法性
    if (e.detail.value.college.length == 0 && e.detail.value.sex.length == 0 && e.detail.value.nickname.length == 0) {
      wx.showToast({
        title: '信息不能为空',
        image: '/images/icons/tip.png'
      })
    } else {
      if (e.detail.value.nickname.length != 0) {
        this.setData({
          nickname: e.detail.value.nickname
        })
      }
      if (e.detail.value.college.length != 0){
        this.setData({
          college: e.detail.value.college
        })
      }
      if (e.detail.value.sex.length != 0) {
        this.setData({
          sex: e.detail.value.sex
        })
      }
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
          college: this.data.college,
          sex: this.data.sex,
          nickName: this.data.nickname
        },
        success: res => {
          console.log("res.data.statusCode: " + res.data.statusCode);
          if (res.data.statusCode == 102) {
            wx.showToast({
              title: '修改成功',
              image: '/images/icons/success.png'
            })
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/user/user',
              })
            }, 2000)
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