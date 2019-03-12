const app = getApp()

Page({

  data: {
    userinfo: {},
    phone: '',
    isdisabled: true
  },

  //get userinfo
  onLoad: function(){
    this.setData({
      userinfo: app.globalData.userInfo
    })
  },

  //get phone
  getNum: function(e){
    this.setData({
      phone: e.detail.value
    })
  },

  //check phone number
  checkNum:function(e){
    var regNum = new RegExp('[0-9]{11}');
    if (!regNum.test(this.data.phone)) {
      wx.showToast({
        title: '手机号错误',
        image: '/images/icons/tip.png'
      })
      this.setData({
        isdisabled: true
      })
      return false;
    } else {
      this.setData({
        isdisabled: false
      })
    }
  },

  //get verifycode
  getCode: function(e){
    this.setData({
      isdisabled: true
    })
    wx.request({
      url: '',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        phone: this.data.phone,
        type: 0
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 100) {
          wx.showToast({
            title: '发送中...',
            image: '/images/icons/loading.png'
          })
        } else if (res.data.statusCode == -1) {
          wx.showToast({
            title: '该账号已注册',
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

  formSubmit: function(e){
    console.log(this.data.userinfo);
    console.log(e.detail.value);
    //正则式
    var regStu = new RegExp('[0-9]{10}');
    var regNum = new RegExp('[0-9]{11}');
    var regCode = new RegExp('[0-9]{6}');
    var regPwd = new RegExp('[0-9a-zA-Z]{6,20}');
    //验证表单合法性
    if (e.detail.value.stuName.length == 0 || e.detail.value.stuNum.length == 0 ||e.detail.value.phone.length == 0 || e.detail.value.sex.length == 0 || e.detail.value.password.length == 0 ||  e.detail.value.verifycode.length == 0) {
      wx.showToast({
        title: '信息不能为空',
        image: '/images/icons/tip.png'
      })
    } else if (!regStu.test(e.detail.value.stuNum) || !regNum.test(e.detail.value.phone) || !regPwd.test(e.detail.value.password) || !regCode.test(e.detail.value.verifycode)) {
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
          stuNum: e.detail.value.stuNum, 
          name: e.detail.value.stuName,
          nickName: this.data.userinfo.nickName,
          pictureUrl: this.data.userinfo.avatarUrl,
          phone: e.detail.value.phone,
          sex: e.detail.value.sex,
          password: e.detail.value.password,
          verifycode: e.detail.value.verifycode
        },
        success: res => {
          if(res.data.statusCode == 101){
            wx.showToast({
              title: '注册成功',
              image: '/images/icons/success.png'
            })
            setTimeout(function(){
              wx.redirectTo({
                url: '../login/login',
              })
            },2000)
          } else if (res.data.statusCode == -3){
            wx.showToast({
              title: '验证码错误',
              image: '/images/icons/tip.png'
            })
          } else if (res.data.statusCode == -4) {
            wx.showToast({
              title: '请勿重复注册',
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