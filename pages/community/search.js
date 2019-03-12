Page({

  data: {
    userId: '',
    token: '',
    url: '',
    results: [],
    psize: 8,
    totalPages: 0,
    currentPage: 1,
    isLoading: true,
    isnothing: true,
    key: ''
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
  },

  //search
  formSubmit: function (e) {
    console.log(e.detail.value);
    this.setData({
      results: {}
    })
    //验证表单合法性
    if (e.detail.value.key.length == 0) {
      wx.showToast({
        title: '不能为空',
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
          key: e.detail.value.key,
          start_num: 0,
          page_size: this.data.psize
        },
        success: res => {
          console.log(res.data);
          if (res.data.statusCode == 100) {
            if (res.data.result_count !== 0) {
              this.setData({
                results: res.data.result,
                totalPages: res.data.result_count,
                isLoading: false,
                currentPage: 0,
                isnothing: true
              })
            } else {
              this.setData({
                isnothing: false
              })
            }
          } else if (res.data.statusCode == -1) {
            this.setData({
              isnothing: false
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
        key: e.detail.value.key
      })
    }
  },

  //触底加载更多
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
        userId: this.data.userId,
        key: this.data.key,
        start_num: this.data.currentPage,
        page_size: this.data.psize
      },
      success: res => {
        console.log(res.data);
        if (res.data.statusCode == 100) {
          if (res.data.result_count !== 0) {
            that.setData({
              results: this.data.results.concat(res.data.result),
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

  toBook: function (e) {
    wx.navigateTo({
      url: '../home/project/provide/bookdetail?bookid=' + e.currentTarget.dataset.bookid
    })
  },

  //限制登录用户
  toPost: function (e) {
    if (this.data.userId == '' || this.data.token == '') {
      wx.showToast({
        title: '请先登录',
        image: '/images/icons/tip.png'
      })
    } else {
      wx.navigateTo({
        url: 'addpost?bookid=' + e.currentTarget.dataset.bookid + '&bookname=' + e.currentTarget.dataset.bookname
      })
    }
  }
})