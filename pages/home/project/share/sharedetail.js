// pages/home/project/share/sharedetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    token: '',
    delieverWay: 0,
    sTime: '',
    date: '',
    slot: [],
    slottime: '',
    isbn: '',
    bookname: '',
    author: '',
    pub: ''
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
    console.log(options)
    //获取书籍信息
    this.setData({
      isbn: options.isbn,
      bookname: options.bookname,
      author: options.author,
      pub: options.pub
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

  //获取交接方式
  radioChange: function (e) {
    this.setData({
      delieverWay: e.detail.value
    })
  },

  //获取日期
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

  //获取时间段
  bindPickerChange: function (e) {
    this.setData({
      slottime: this.data.slot[e.detail.value].slotTime
    })
  },

  //share
  formSubmit: function (e) {
    console.log(e.detail.value);
    var regNum = new RegExp('[0-9]{11}');

    //验证表单合法性
    if (e.detail.value.isbn.length == 0 || e.detail.value.bookName.length == 0 || e.detail.value.author.length == 0 || e.detail.value.pubHouse.length == 0 || e.detail.value.delieverWay.length == 0) {
      wx.showToast({
        title: '信息不能为空',
        image: '/images/icons/tip.png'
      })
    } else if (!regNum.test(e.detail.value.phone)) {
      wx.showToast({
        title: '手机号格式错误',
        image: '/images/icons/tip.png'
      })
    } else if (this.data.delieverWay == 0 && (this.data.date.length == 0 || this.data.slottime.length == 0)) {
      wx.showToast({
        title: '请选择时间',
        image: '/images/icons/tip.png'
      })
    } else if (this.data.delieverWay == 1 && e.detail.value.location.length == 0) {
      wx.showToast({
        title: '请填写地址',
        image: '/images/icons/tip.png'
      })
    } else {
      //提交表单信息 
      //自送方式
      if (this.data.delieverWay == 0){
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
            bookId: e.detail.value.isbn,
            bookName: e.detail.value.bookName,
            author: e.detail.value.author,
            pubHouse: e.detail.value.pubHouse,
            delieverWay: e.detail.value.delieverWay,
            send_time: this.data.date,
            slotTime: this.data.slottime,
            phone: e.detail.value.phone
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
                title: '提交成功',
                image: '/images/icons/success.png'
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/home/home',
                })
              },2000)
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
      //等收方式
      if (this.data.delieverWay == 1) {
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
            bookId: e.detail.value.isbn,
            bookName: e.detail.value.bookName,
            author: e.detail.value.author,
            pubHouse: e.detail.value.pubHouse,
            delieverWay: e.detail.value.delieverWay,
            location: e.detail.value.location,
            phone: e.detail.value.phone
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
                title: '提交成功',
                image: '/images/icons/success.png'
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/home/home',
                })
              },2000)
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
  }
})