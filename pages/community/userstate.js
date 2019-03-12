// pages/community/userstate.js
const app = getApp()

Page({

  data: {
    load: true,
    userId: '',
    token: '',
    ouserid: '',
    oinfo: '',
    url: '',
    posts: [],
    psize: 50,
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

    this.setData({
      ouserid: options.userid
    })

    //getouser
    wx.request({
      url: '',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-key': this.data.userId,
        'x-token': this.data.token
      },
      method: 'POST',
      data: {
        userId: this.data.ouserid
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 102) {
          this.setData({
            oinfo: res.data.result
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
        userId: this.data.ouserid,
        rankby: 0,
        stu_num: 0,
        page_size: this.data.psize
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 100) {
          if (res.data.result_count != 0) {
            this.setData({
              posts: res.data.result,
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

  follow:function(e){
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      console.log(e.currentTarget.dataset.fid);
      wx.request({
        url: '',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-key': this.data.userId,
          'x-token': this.data.token
        },
        method: 'POST',
        data: {
          attentionUserId: this.data.userId,
          beAttentionUserId: e.currentTarget.dataset.fid
        },
        success: res => {
          console.log(res.data);
          if (res.data.statusCode == 102) {
            wx.showToast({
              title: '关注成功',
              image: '/images/icons/success.png'
            })
          } else if (res.data.statusCode == -200) {
            wx.showToast({
              title: '关注过啦',
              image: '/images/icons/tip.png'
            })
          } else if (res.data.statusCode == -400) {
            wx.showToast({
              title: '是你自己',
              image: '/images/icons/tip.png'
            })
          }else {
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