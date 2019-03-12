// pages/community/report.js

Page({

  data: {
    load: true,
    userId: '',
    token: '',
    ruserid: '',
    type: 0,
    title: '',
    cid: '',
    ucid: '',
    content: ''
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
    console.log(options);
    this.setData({
      ruserid: options.userid,
      content: options.content
    })
    if (options.type == 0){
      this.setData({
        type: 0,
        title: options.title,
        cid: options.commentid
      })
    }
    if (options.type == 1) {
      this.setData({
        type: 1,
        ucid: options.ucommentid
      })
    }
    this.setData({
      load: false
    })
  },

  //report
  formSubmit: function (e) {
    console.log(e.detail.value);

    if (e.detail.value.rdetail.length == 0) {
      wx.showToast({
        title: '请举报有效信息',
        image: '/images/icons/tip.png'
      })
    } else {
      if(this.data.type == 0){
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
            userId: this.data.ruserid,
            title: this.data.title,
            commentId: this.data.cid,
            content: this.data.content,
            detail: e.detail.value.rdetail
          },
          success: res => {
            console.log(res.data);
            if (res.data.statusCode == 102) {
              wx.showToast({
                title: '感谢反馈',
                image: '/images/icons/success.png'
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/community/community',
                })
              }, 2000)
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
    }
    if (this.data.type == 1) {
      wx.request({
        url: '',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-key': this.data.userId,
          'x-token': this.data.token
        },
        method: 'POST',
        data: {
          type: 1,
          userId: this.data.ruserid,
          uCommentId: this.data.ucid,
          content: this.data.content,
          detail: e.detail.value.rdetail
        },
        success: res => {
          console.log(res.data);
          if (res.data.statusCode == 102) {
            wx.showToast({
              title: '感谢反馈',
              image: '/images/icons/success.png'
            })
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/community/community',
              })
            }, 2000)
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
  }
})