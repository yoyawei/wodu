// pages/home/project/provide/get.js
Page({

  data: {
    load: true,
    userId: '',
    token:'',
    sTime: '',
    bookid: '',
    bookname: '',
    date: '',
    slot: [],
    slottime: '',
    agreement: '',
    agreed: false
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
    console.log(options);
    this.setData({
      bookid: options.bookid,
      bookname: options.bookname
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
        console.log(res.data);
        if (res.data.statusCode == 102) {
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
    //get agreement
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
        if (res.data.statusCode == 102) {
          this.setData({
            agreement: res.data.result.userProtocol
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

  //表单日期
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

  //设置时间段
  bindPickerChange: function (e) {
    this.setData({
      slottime: this.data.slot[e.detail.value].slotTime
    })
  },

  //order
  formSubmit: function(e){
    //console.log(e.detail.value);
    var week = new Date(this.data.date);

    //验证表单合法性
    if (this.data.date.length == 0 || this.data.slottime.length == 0){
      wx.showToast({
        title: '请选择时间',
        image: '/images/icons/tip.png'
      })
    } else if (week.getDay() !== 5) {
      wx.showToast({
        title: '请选择周五',
        image: '/images/icons/tip.png'
      })
    } else if(e.detail.value.phone.length != 11){
      wx.showToast({
        title: '请填写手机号',
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
          userId: this.data.userId,
          bookId: this.data.bookid,
          taken_date: this.data.date,
          timeSlot: this.data.slottime,
          phone: e.detail.value.phone
        },
        success: res => {
          console.log(res.data);
          if (res.data.statusCode == 102) {
            wx.showToast({
              title: '成功，请等审核',
              image: '/images/icons/success.png'
            })
          } else if(res.data.statusCode == -1){
            wx.showToast({
              title: '系统错误，请重试',
              image: '/images/icons/tip.png'
            })
          } else if (res.data.statusCode == 0) {
            wx.showToast({
              title: '抱歉！无库存',
              image: '/images/icons/tip.png'
            })
          } else if (res.data.statusCode == 1) {
            wx.showToast({
              title: '请勿重复预约',
              image: '/images/icons/tip.png'
            })
          } else if (res.data.statusCode == 2) {
            wx.showToast({
              title: '超出预约数',
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
  },

  agree: function(){
    this.setData({
      agreed: true
    })
  }
})