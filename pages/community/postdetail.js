// pages/community/addComment.js
const app = getApp()

Page({

  data: {
    load: true,
    userId: '',
    token: '',
    url: '',
    commentid: '',
    post: '',
    addcomment: '',
    comments: [],
    ctype: 0,
    uCommentId: '',
    placeword: '评论',
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

    //get commentid
    this.setData({
      commentid: options.commentid,
      ctype: 0,
      placeword: '评论'
    })
     console.log(options.commentid);
     console.log(this.data.commentid);

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
        type: 1,
        commentId: this.data.commentid
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 102) {
          this.setData({
            post: res.data.post
          })
          this.data.post.pubDate = new Date(this.data.post.pubDate).toString().substring(0, 21);
          this.setData({
            post: this.data.post
          })
          if (res.data.post.commentCnt !== 0) {
            this.setData({
              comments: res.data.post.commentList
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
        type: 1,
        commentId: this.data.commentid
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 102) {
          this.setData({
            post: res.data.post
          })
          this.data.post.pubDate = new Date(this.data.post.pubDate).toString().substring(0, 21);
          this.setData({
            post: this.data.post
          })
          if (res.data.post.commentCnt !== 0) {
            this.setData({
              comments: res.data.post.commentList
            })
            this.toDate();
          }
          wx.stopPullDownRefresh()
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

  toDate: function () {
    this.data.post.pubDate = app.timestampToTime(this.data.post.pubDate);
    this.setData({
      post: this.data.post
    })
    for (let i = 0; i < this.data.comments.length; i++) {
      this.data.comments[i].time = app.timestampToTime(this.data.comments[i].time);
      this.setData({
        comments: this.data.comments
      })
    }
  },

  previewImg: function (e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.http] // 需要预览的图片http链接列表
    })
  },

  ctobook: function () {
    this.setData({
      ctype: 0,
      addcomment: '',
      placeword: '评论'
    })
  },

  ctouser: function (e) {
    //console.log(e.currentTarget.dataset);
    this.setData({
      ctype: 1,
      uCommentId: e.currentTarget.dataset.ucommentid,
      addcomment: '',
      placeword: '回复 ' + e.currentTarget.dataset.fname
    })
  },

  //限制登录用户
  Star: function () {;
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
          commentId: this.data.commentid
        },
        success: res => {
          console.log(res.data);
          if (res.data.statusCode == 102) {
            this.data.post.stars++;
            this.setData({
              post: this.data.post
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

  toBook: function (e) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: '../home/project/provide/bookdetail?bookid=' + e.currentTarget.dataset.bookid
      })
    }
  },

  toReport: function (e) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: 'report?commentid=' + e.currentTarget.dataset.commentid + '&title=' + e.currentTarget.dataset.title + '&userid=' + e.currentTarget.dataset.userid + '&type=0' + '&content=' + e.currentTarget.dataset.content
      })
    }
  },

  toReport2: function (e) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: 'report?ucommentid=' + e.currentTarget.dataset.ucommentid + '&userid=' + e.currentTarget.dataset.userid + '&type=1' + '&content=' + e.currentTarget.dataset.content
      })
    }
  },

  setContent: function (e) {
    this.setData({
      addcomment: e.detail.value
    })
  },

  newcomment: function () {
    // console.log(this.data.addcomment);
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      if (this.data.addcomment.length == 0) {
        wx.showToast({
          title: '评论不可为空',
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
            commentId: this.data.commentid,
            type: this.data.ctype,
            content: this.data.addcomment,
            uCommentId: this.data.uCommentId
          },
          success: res => {
            console.log('res.data');
            console.log(res.data);
            console.log('this.data');
            console.log(this.data);
            if (res.data.statusCode == 102) {
              wx.showToast({
                title: '评论成功',
                image: '/images/icons/success.png'
              })
              this.setData({
                addcomment: '',
                ctype: 0,
                uCommentId: '',
                placeword: '评论'
              })
              this.refresh();
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
  },

  //实时显示评论
  refresh: function () {
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
        commentId: this.data.commentid
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == -200) {
          wx.showToast({
            title: '登录失效',
            image: '/images/icons/tip.png'
          })
        } else if (res.data.statusCode == 102) {
          if (res.data.post.commentCnt !== 0) {
            this.setData({
              comments: res.data.post.commentList
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
  }
})