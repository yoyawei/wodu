// pages/community/community.js
const app = getApp()

Page({

  data: {
    load: true,
    userId: '',
    token: '',
    url: '',
    posts: [],
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
    //getPosts
    wx.request({
      url: '',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-key': this.data.userId,
        'x-token': this.data.token
      },
      method: 'POST',
      data: {
        type: 0,
        start_num: 0,
        page_size: this.data.psize
      },
      success: res => {
        // console.log(res.data);
        if (res.data.statusCode == 102) {
          this.setData({
            posts: res.data.posts,
            totalPages: res.data.result_count,
            isLoading: false,
            currentPage: 0
          })
          this.toDate();
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
    }),
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
        type: 0,
        start_num: 0,
        page_size: this.data.psize
      },
      success: res => {
        // console.log(res.data);
        if (res.data.statusCode == 102) {
          this.setData({
            posts: res.data.posts,
            totalPages: res.data.result_count,
            isLoading: false,
            currentPage: 0
          })
          this.toDate();
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

  //get more Posts
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
        type: 0,
        start_num: this.data.currentPage,
        page_size: this.data.psize
      },
      success: res => {
        // console.log(res.data);
        if (res.data.statusCode == 102) {
          if (res.data.result_count !== 0) {
            this.setData({
              posts: this.data.posts.concat(res.data.posts),
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

  toDate: function () {
    for (let i = 0; i < this.data.posts.length; i++) {
      this.data.posts[i].pubDate = app.timestampToTime(this.data.posts[i].pubDate);
      this.setData({
        posts: this.data.posts
      })
    }
  },

  previewImg: function (e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.http] // 需要预览的图片http链接列表
    })
  },

  toComment: function (e) {
    wx.navigateTo({
      url: 'postdetail?commentid=' + e.currentTarget.dataset.commentid
    })
  },

  toBook: function (e) {
    wx.navigateTo({
      url: '../home/project/provide/bookdetail?bookid=' + e.currentTarget.dataset.bookid
    })
  },

  //限制登录用户

  Star: function (e) {
    var temp = e.currentTarget.dataset.index;
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
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
          commentId: e.currentTarget.dataset.commentid
        },
        success: res => {
          console.log(res.data);
          if (res.data.statusCode == 102) {
            this.data.posts[temp].stars++;
            this.setData({
              posts: this.data.posts
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

  toUser: function (e) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: 'userstate?userid=' + e.currentTarget.dataset.userid
      })
    }
  },

  toAdd: function () {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: 'search'
      })
    }
  }
})