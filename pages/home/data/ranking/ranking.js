// pages/home/data/ranking/ranking.js
Page({

  data: {
    load: true,
    userId: '',
    token: '',
    url: '',
    books: [],
    psize: 9,
    totalPages: 0,
    currentPage: 1,
    isLoading: true
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
    //get books list
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
        randby: 1,
        start_num: 0,
        page_size: this.data.psize
      },
      success: res => {
        // console.log(res.data);
        if (res.data.statusCode == 100) {
          this.setData({
            books: res.data.result,
            totalPages: res.data.result_count,
            isLoading: false,
            currentPage: 0
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
  toBook: function (e) {
    wx.navigateTo({
      url: '../../project/provide/bookdetail?bookid=' + e.currentTarget.dataset.bookid
    })
  },
})