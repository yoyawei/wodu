Page({

  data: {
    userId: '',
    token: '',
    sTime: '',
    date: '',
    slot: [],
    slottime: '',
    bookname: '',
    userid: '',
    rid: ''
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
    // console.log(options);
    this.setData({
      bookname: options.bookname,
      userid: options.userid,
      rid: options.rid
    })
    //set startDate
    var now = new Date();
    this.setData({
      sTime: now
    })
    //get time
    wx.request({
      url: '',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-key': this.data.userId,
        'x-token': this.data.token
      },
      method: 'POST',
      data: {},
      success: res => {
        console.log('slot:');
        console.log(res.data);
        if (res.data.statusCode == -200) {
          wx.showToast({
            title: '登录失效',
            image: '/images/icons/tip.png'
          })
        } else if (res.data.statusCode == 102) {
          this.setData({
            slot: res.data.result
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

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
    var week = new Date(this.data.date);
    if (week.getDay() !== 5) {
      wx.showToast({
        title: '请选择周五',
        image: '/images/icons/tip.png'
      })
    }
  },

  bindPickerChange: function (e) {
    this.setData({
      slottime: this.data.slot[e.detail.value].slotTime
    })
  },

  formSubmit: function (e) {
    console.log('this.data');
    console.log(this.data);
    console.log(e.detail.value);
    var week = new Date(this.data.date);
    //验证表单合法性

    if (this.data.date.length == 0 || this.data.slottime.length == 0) {
      wx.showToast({
        title: '请选择时间',
        image: '/images/icons/tip.png'
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else if (week.getDay() !== 5) {
      wx.showToast({
        title: '请选择周五',
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
          userId: this.data.userid,
          reservationId: this.data.rid,
          deadline: this.data.date,
          soltTime: this.data.slottime
        },
        success: res => {
          console.log(res.data);
          if (res.data.statusCode == -200) {
            wx.showToast({
              title: '登录失效',
              image: '/images/icons/tip.png'
            })
          } else if (res.data.statusCode == 102) {
            wx.showToast({
              title: '请按时还书',
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
            title: '服务器错误',
            image: '/images/icons/tip.png'
          })
        }
      })
    }
  }
})