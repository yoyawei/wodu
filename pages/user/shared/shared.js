// pages/home/project/share/share.js
const app = getApp()

Page({

  data: {
    load: true,
    userId: '',
    token: '',
    url: '',
    books: [],
    psize: 8,
    totalPages: 0,
    currentPage: 1,
    isLoading: false,
    states: [
      '待交接',
      '已取消',
      '已入库',
      '待交书'
    ]
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
    //getMyAllReservations
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
        stu_num: 0,
        page_size: this.data.psize
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == -200) {
          wx.showToast({
            title: '登录失效',
            image: '/images/icons/tip.png'
          })
        } else if (res.data.statusCode == 100) {
          if (res.data.result_count !== 0) {
            this.setData({
              books: res.data.result,
              totalPages: res.data.result_count,
              isLoading: false,
              currentPage: 0
            })
            this.toDate();
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
    this.setData({
      load: false
    })
  },

  onPullDownRefresh: function (){
    //getMyAllReservations
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
        stu_num: 0,
        page_size: this.data.psize
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == -200) {
          wx.showToast({
            title: '登录失效',
            image: '/images/icons/tip.png'
          })
        } else if (res.data.statusCode == 100) {
          if (res.data.result_count !== 0) {
            this.setData({
              books: res.data.result,
              totalPages: res.data.result_count,
              isLoading: false,
              currentPage: 0
            })
            this.toDate();
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
      },
      complete: e => {
        wx.stopPullDownRefresh();
      }
    })
  },

  //触底加载更多
  onReachBottom() {
    console.log(this.data);
    console.log('in inbottom');

    let { currentPage, totalPages, isLoading } = this.data;
    if (currentPage >= totalPages || isLoading) {
      return;
    }
    this.setData({
      isLoading: true,
      currentPage: this.data.currentPage + this.data.psize
    })
    // console.log(this.data.currentPage);
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
        stu_num: this.data.currentPage,
        page_size: this.data.psize
      },
      success: res => {
        console.log(res.data);
        console.log('result');
        if (res.data.statusCode == -200) {
          wx.showToast({
            title: '登录失效',
            image: '/images/icons/tip.png'
          })
        } else if (res.data.statusCode == 100) {
          if (res.data.result_count !== 0) {
            this.setData({
              books: this.data.books.concat(res.data.result),
              totalPages: res.data.result_count + this.data.totalPages,
              isLoading: false
            })
            this.toDate();
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

  //cancelOrder
  cancelOrder: function (e) {
    if (e.currentTarget.dataset.bstatus !== 0) {
      wx.showToast({
        title: '不可取消',
        image: '/images/icons/tip.png'
      })
      return;
    }
    wx.request({
      url: '',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-key': this.data.userId,
        'x-token': this.data.token
      },
      method: 'POST',
      data: {
        shareId: e.currentTarget.dataset.sid
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == -200) {
          wx.showToast({
            title: '登录失效',
            image: '/images/icons/tip.png'
          })
        } else if (res.data.statusCode == 102) {
          this.setData({
            books: []
          })
          wx.showToast({
            title: '成功，下拉刷新   ',
            image: '/images/icons/success.png'
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

  toDate: function () {
    for (let i = 0; i < this.data.books.length; i++) {
      this.data.books[i].proposedDate = app.timestampToTime(this.data.books[i].proposedDate);
      this.setData({
        books: this.data.books
      })
    }
  }
})