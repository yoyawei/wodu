Page({

  data: {
    userId: '',
    token: '',
    isbn: '',
    detail:{},
    scaned: false
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
    // if (this.data.userId == '' || this.data.token == '') {
    //   wx.showToast({
    //     title: '请先登录',
    //     image: '/images/icons/tip.png'
    //   })
    //   setTimeout(function () {
    //     wx.switchTab({
    //       url: '/pages/home/home',
    //     })
    //   }, 1500)
    // }
  },

  toScan:function(){
    wx.scanCode({
      success: (res) => {
        console.log(res)
        this.setData({
          isbn: res.result
        })
        wx.request({
          url: '',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-key': this.data.userId,
            'x-token': this.data.token
          },
          method: 'POST',
          data: {
            isbn: this.data.isbn
          },
          success: res => {
            console.log(res);
            this.setData({
              detail: res.data.result,
              scaned: true
            })
            //console.log(this.data.detail)
          },
          fail: e => {
            wx.showToast({
              title: '服务器错误',
              image: '/images/icons/tip.png'
            })
          }
        })
      }
    })
  },

  Reset: function (e) {
    this.setData({
      scaned: false,
      detail: {}
    })
  },

  //限制登录用户
  toShare: function (e) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: 'sharedetail?isbn=' + this.data.detail.bookId + '&bookname=' + this.data.detail.bookName + '&author=' + this.data.detail.author + '&pub=' + this.data.detail.pubHouse 
      })
    }
  },

  directShare: function (e) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: 'sharedetail'
      })
    }
  }

})