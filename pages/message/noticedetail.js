// pages/message/noticedetail.js
const app = getApp()

Page({

  data: {
    load: true,
    userId: '',
    token: '',
    messageid: '',
    messagetype: 0,
    notice: '',
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
    //get messageid and type
    this.setData({
      messageid: options.messageid,
      messagetype: options.messagetype
    })
    console.log(this.data.messageid);
    console.log(this.data.messagetype);
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
        messageId: this.data.messageid
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 102) {
          this.setData({
            notice: res.data.result
          })
          this.data.notice.date = app.timestampToTime(this.data.notice.date);
          this.setData({
            notice: this.data.notice
          })
          console.log(this.data.notice)
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

  toPost: function (e) {
    wx.navigateTo({
      url: '../community/postdetail?commentid=' + e.currentTarget.dataset.commentid
    })
  }
})