// pages/home/home.js

Page({

  data: {
    load: true,
    userId: "",
    token: "",
    imgUrls: [{
      name: "分享会",
      imgurl: "/images/banner1.jpg",
      navi: "activity/meeting/meeting"
    }, {
      name: "投票",
      imgurl: "/images/banner2.jpg",
      navi: "activity/vote/vote"
    }, {
      name: "广告",
      imgurl: "/images/banner3.jpg",
      navi: "activity/ad/ad"
    }],
    url: '',
    books: [],
    bestpost: [],
    rbook: []
  },

  onLoad: function (options) {
    //排行榜
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
        page_size: 6
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 100) {
          this.setData({
            books: res.data.result
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
    //精彩书评
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
        page_size: 2
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 102) {
          this.setData({
            bestpost: res.data.result
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

    //好书推荐
    wx.request({
      url: '',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-key': this.data.userId,
        'x-token': this.data.token
      },
      method: 'POST',
      data: {
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 102) {
          this.setData({
            rbook: res.data.books
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
      url: 'project/provide/bookdetail?bookid=' + e.currentTarget.dataset.bookid
    })
  }
})