// pages/login/login.js
Page({

  data: {
  },

  //login
  formSubmit: function(e){
    console.log(e.detail.value);
    var regNum = new RegExp('[0-9]{11}');


	if(!regNum.test(e.detail.value.phone)) {
      wx.showToast({
        title: '账号格式错误',
        image: '/images/icons/tip.png'
      })
    } else if(e.detail.value.password.length == 0) {
      wx.showToast({
        title: '密码不能为空',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.request({
        url: '',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          phone: e.detail.value.phone,
          password: e.detail.value.password
        },
        success: res => {
          console.log(res.data);
          if(res.data.statusCode == 102){
            wx.showToast({
              title: '登录中',
              image: '/images/icons/loading.png'
            })
            wx.setStorage({
              key: 'userId',
              data: res.data.result.userId
            }),
            wx.setStorage({
              key: 'token',
              data: res.data.result.token
            }),   
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/home/home'
              })
            }, 2000)
          } else if (res.data.statusCode == 400){
            wx.showToast({
              title: '登录信息错误',
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