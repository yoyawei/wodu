// pages/user/status/status.js
const app = getApp()

Page({

  data: {
    load: true,
    userId: '',
    token: '',
    url: '',
    books: [],
    psize: 5,
    totalPages: 0,
    currentPage: 1,
    isLoading: false,
    states:[
      '待审核',
      '待领取',
      '审核失败',
      '待归还',
      '已超期',
      '已归还'
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
    //getMyAllReservations
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
        stu_num: 0,
        page_size: this.data.psize
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == -200) {
          wx.showToast({
            title: '登录失效',
            image: '/images/icons/tip.png'
          })
        } else if (res.data.statusCode == 100) {
          if (res.data.result_count !== 0){
            this.setData({
              books: res.data.result,
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

  //刷新
  onPullDownRefresh: function (){
    //getMyAllReservations
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
        stu_num: 0,
        page_size: this.data.psize
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == -200) {
          wx.showToast({
            title: '登录失效',
            image: '/images/icons/tip.png'
          })
        } else if (res.data.statusCode == 100) {
          if (res.data.result_count !== 0) {
            this.setData({
              books: res.data.result,
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
    console.log(this.data);
    console.log('in inbottom');

    let { currentPage, totalPages, isLoading } = this.data;
    if (currentPage >= totalPages || isLoading) {
      return;
    }
    this.setData({
      isLoading: true,
      currentPage: this.data.currentPage + this.data.psize
    })
    // console.log(this.data.currentPage);
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
        stu_num: this.data.currentPage,
        page_size: this.data.psize
      },
      success: res => {
        console.log(res.data);
        console.log('result');
        if (res.data.statusCode == -200) {
          wx.showToast({
            title: '登录失效',
            image: '/images/icons/tip.png'
          })
        } else if (res.data.statusCode == 100) {
          if (res.data.result_count !== 0) {
            this.setData({
              books: this.data.books.concat(res.data.result),
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
    for (let i = 0; i < this.data.books.length; i++) {
      this.data.books[i].takenDate = app.timestampToTime(this.data.books[i].takenDate);
      this.data.books[i].returnDate = app.timestampToTime(this.data.books[i].returnDate);
      this.setData({
        books: this.data.books
      })
    }
  },

  toBook: function (e) {
    wx.navigateTo({
      url: '../../home/project/provide/bookdetail?bookid=' + e.currentTarget.dataset.bookid
    })
  },

  //限制登录用户

  //取消预约
  cancelOrder: function(e){
    if (e.currentTarget.dataset.bstatus !== 0){
      wx.showToast({
        title: '不可取消',
        image: '/images/icons/tip.png'
      })
      return ;
    }
    wx.request({
      url: '',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-key': this.data.userId,
        'x-token': this.data.token
      },
      method: 'POST',
      data: {
        userId: e.currentTarget.dataset.userid,
        bookId: e.currentTarget.dataset.bookid,
        reservationId: e.currentTarget.dataset.reid
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 102) {
          this.setData({
            books:[]
          })
          wx.showToast({
            title: '成功，下拉更新',
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
  },

  //还书
  toReturn: function (e) {
    if (e.currentTarget.dataset.bstatus < 3 || e.currentTarget.dataset.bstatus > 4) {
      wx.showToast({
        title: '不可还书',
        image: '/images/icons/tip.png'
      })
      return;
    }
    wx.navigateTo({
      url: 'return?bookname=' + e.currentTarget.dataset.bname + '&userid=' + e.currentTarget.dataset.userid + '&rid=' + e.currentTarget.dataset.reid
    })
  },

  //发表书评
  toPost: function (e) {
    console.log('dataset: ' + e.currentTarget.dataset);
    wx.navigateTo({
      url: '../../community/addpost?bookid=' + e.currentTarget.dataset.bookid + '&bookname=' + e.currentTarget.dataset.bookname
    })
  }

})