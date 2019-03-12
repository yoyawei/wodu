Page({

  data: {
    load: true,
    userId: '',
    token: '',
    status: -2,
    url: '',
    books: []
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
    //get status and books
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
            title: '请先登录',
            image: '/images/icons/tip.png'
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../../home',
            })
          }, 1000)
        } else if (res.data.statusCode === 0) {
          this.setData({
            status: 0
          })
        } else if (res.data.statusCode === 1) {
          this.setData({
            status: 1,
            books: res.data.result
          })
        } else if (res.data.statusCode === 2) {
          this.setData({
            status: 2,
            books: res.data.result
          })
        } else if (res.data.statusCode === -1) {
          this.setData({
            status: 0
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

  //to vote
  onVote: function (e) {
    var temp = e.currentTarget.dataset.index;
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
        voteBookId: e.currentTarget.dataset.bookid
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == -200) {
          wx.showToast({
            title: '请先登录',
            image: '/images/icons/tip.png'
          })
        } else if (res.data.statusCode == 102) {
          this.data.books[temp].votes++;
          this.setData({
            books: this.data.books
          })
          wx.showToast({
            title: '投票成功',
            image: '/images/icons/success.png'
          })
        } else if (res.data.statusCode == -100) {
          wx.showToast({
            title: '一天后再来',
            image: '/images/icons/tip.png'
          })
        } else if (res.data.statusCode == -1) {
          wx.showToast({
            title: '投票失败',
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
})