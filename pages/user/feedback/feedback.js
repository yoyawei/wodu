// pages/user/feedback/feedback.js
Page({

  data: {
    userId: '',
    token: '',
    imgurl: '/images/icons/addimg.png'
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

  //选择本地图片
  selectPhoto: function(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], 
      sourceType: ['album','camera'], 
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          imgurl: res.tempFilePaths[0]
        })
        // console.log(this.data.imgurl)
      }
    })
  },

  //feedback
  formSubmit: function (e) {
	console.log(e.detail.value);
    
    if (e.detail.value.title.length == 0 || e.detail.value.content.length == 0 || this.data.imgurl == '/images/icons/addimg.png'){
      wx.showToast({
        title: '请反馈有效信息',
        image: '/images/icons/tip.png'
      })
    } else {
      console.log(this.data.imgurl)
      wx.uploadFile({
        url: '',
        filePath: this.data.imgurl,
        name: 'image',
        header: { 
          'Content-Type': 'multipart/form-data',
          'x-key': this.data.userId,
          'x-token': this.data.token
        },
        formData: {
          userId: this.data.userId,
          title: e.detail.value.title,
          detail: e.detail.value.content
        },
        success: res => {
          console.log(res.data);
          if (res.data.indexOf('102') > 0) {
            wx.showToast({
              title: '反馈成功',
              image: '/images/icons/success.png'
            })
          } else if (res.data.indexOf('-1') > 0){
            wx.showToast({
              title: '反馈失败',
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