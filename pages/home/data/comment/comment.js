// pages/home/data/comment/comment.js
const app = getApp()

Page({

  data: {
    load: true,
    userId: '',
    token: '',
    url: '',
    results: [],
    psize: 5,
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
    //get results list
    wx.request({
      url: '',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-key': this.data.userId,
        'x-token': this.data.token
      },
      method: 'POST',
      data: {
        start_num: 0,
        page_size: this.data.psize
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 102) {
          if (res.data.result_count != 0){
            this.setData({
              results: res.data.result,
              totalPages: res.data.result_count,
              isLoading: false,
              currentPage: 0
            })
            this.toDate();
          } else {
            this.setData({
              istip: false
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
    this.setData({
      load: false
    })
  },

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
        start_num: 0,
        page_size: this.data.psize
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 102) {
          if (res.data.result_count != 0) {
            this.setData({
              results: res.data.result,
              totalPages: res.data.result_count,
              isLoading: false,
              currentPage: 0
            })
            this.toDate();
          } else {
            this.setData({
              istip: false
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
      },
      complete: e => {
        wx.stopPullDownRefresh();
      }
    })
  },

  //get more
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
        start_num: this.data.currentPage,
        page_size: this.data.psize
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 102) {
          if (res.data.result_count !== 0) {
            this.setData({
              results: this.data.results.concat(res.data.result),
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

  toDate: function () {
    for (let i = 0; i < this.data.results.length; i++) {
      this.data.results[i].postTime = app.timestampToTime(this.data.results[i].postTime);
      this.setData({
        results: this.data.results
      })
    }
  }
})