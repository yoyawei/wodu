// pages/message/message.js

const app = getApp()

Page({

  data: {
    load: true,
    userId: '',
    token: '',
    messages: [],
    psize: 10,
    totalPages: 0,
    currentPage: 1,
    isLoading: false,
    typeid: -1,
    types: [
      '审核通过',
      '审核失败',
      '书籍到库',
      '反馈信息',
      '投诉信息'
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

    this.setData({
      typeid: options.typeid
    })

    //初始加载全部
    //getmessages
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
        isRead: this.data.typeid,
        stu_num: 0,
        page_size: this.data.psize
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 100) {
          if (res.data.result_count !== 0) {
            this.setData({
              messages: res.data.result,
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



  onPullDownRefresh: function () {
    //getmessages
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
        isRead: this.data.typeid,
        stu_num: 0,
        page_size: this.data.psize
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 100) {
          if (res.data.result_count !== 0) {
            this.setData({
              messages: res.data.result,
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
        isRead: this.data.typeid,
        stu_num: this.data.currentPage,
        page_size: this.data.psize
      },
      success: res => {
        console.log(res.data);
        console.log('result');
        if (res.data.statusCode == 100) {
          if (res.data.result_count !== 0) {
            this.setData({
              books: this.data.messages.concat(res.data.result),
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
    for (let i = 0; i < this.data.messages.length; i++) {
      this.data.messages[i].date = app.timestampToTime(this.data.messages[i].date);
      this.setData({
        messages: this.data.messages
      })
    }
  },

  todetail: function (e) {
    console.log(e.currentTarget.dataset.messageid);
    console.log(e.currentTarget.dataset.messagetype);
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: 'noticedetail?messageid=' + e.currentTarget.dataset.messageid + '&messagetype=' + e.currentTarget.dataset.messagetype
      })
    }
  }
})