Page({

  data: {
    load: true,
    userId: '',
    token: '',
    url: '',
    books: [],
    psize: 10,
    totalPages: 0,
    currentPage: 1,
    isLoading: false
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
        randby: 0,
        start_num: 0,
        page_size: this.data.psize
      },
      success: res => {
        if (res.data.statusCode == 100) {
          console.log(res.data);
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

  //刷新
  onPullDownRefresh: function () {
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
        randby: 0,
        start_num: 0,
        page_size: this.data.psize
      },
      success: res => {
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
      },
      complete: e => {
        wx.stopPullDownRefresh();
      }
    })
  },

  //get more books
  onReachBottom() {
    console.log(this.data);
    let { currentPage, totalPages, isLoading } = this.data;
    if (currentPage >= totalPages || isLoading) {
      return;
    }
    this.setData({
      isLoading: true,
      currentPage: this.data.currentPage + this.data.psize
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
        userId: this.data.userId,
        randby: 0,
        start_num: this.data.currentPage,
        page_size: this.data.psize
      },
      success: res => {
        if (res.data.statusCode == 100) {
          if (res.data.result_count !== 0) {
            this.setData({
              books: this.data.books.concat(res.data.result),
              totalPages: res.data.result_count + this.data.totalPages,
              isLoading: false
            })
          }
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

  toBook: function (e) {
    wx.navigateTo({
      url: 'bookdetail?bookid=' + e.currentTarget.dataset.bookid
    })
  },

  //限制登录用户

  //to order book
  toGet: function (e) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: 'get?bookid=' + e.currentTarget.dataset.bookid + '&bookname=' + e.currentTarget.dataset.bookname
      })
    }
  }
})