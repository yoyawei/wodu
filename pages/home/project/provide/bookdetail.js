// pages/community/userstate.js
const app = getApp()

Page({

  data: {
    load: true,
    userId: '',
    token: '',
    booikid: '',
    book: '',
    posts: [],
    url: ''
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
      bookid: options.bookid
    })
    //console.log(this.data.bookid);
    //getbook
    wx.request({
      url: '',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-key': this.data.userId,
        'x-token': this.data.token
      },
      method: 'POST',
      data: {
        isbn: this.data.bookid
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 102) {
            this.setData({
              book: res.data.result
            })
            // console.log(this.data.book);
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

    //getposts
    wx.request({
      url: '',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-key': this.data.userId,
        'x-token': this.data.token
      },
      method: 'POST',
      data: {
        isbn: this.data.bookid
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 102) {
          this.setData({
            posts: res.data.result
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
    })
    this.setData({
      load: false
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

  toComment: function (e) {
    wx.navigateTo({
      url: '../../../community/postdetail?commentid=' + e.currentTarget.dataset.commentid
    })
  },

  //限制登录用户
  toUser: function (e) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: '../../../community/userstate?userid=' + e.currentTarget.dataset.userid
      })
    }
  },

  toAdd: function (e) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: '../../../community/addpost?bookid=' + e.currentTarget.dataset.bookid + '&bookname=' + e.currentTarget.dataset.bookname
      })
    }
  },

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