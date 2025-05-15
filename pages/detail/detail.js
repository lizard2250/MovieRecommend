// pages/detail/detail.js
const app = getApp()
const api = require('../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    detail: {},
    showFullDesc: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id
    this.setData({
      id: id
    })
    this.fetchDetail(id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    const detail = this.data.detail
    return {
      title: detail.title,
      path: `/pages/detail/detail?id=${detail.movie_id}`
    }
  },

  async fetchDetail(id) {
    wx.showLoading({
      title: '加载中',
    })
    
    console.log(`开始获取电影ID: ${id} 的详情`);

    try {
      const detail = await api.getMovieDetail(id)
      console.log(`成功获取电影详情数据:`, detail);
      
      // 设置页面标题
      wx.setNavigationBarTitle({
        title: detail.title
      })
      
      // 更新数据，添加图片URL
      detail.imageUrl = `http://47.120.72.255/mobile/movie/photo/${detail.movie_id}`
      
      this.setData({
        detail: detail
      })
      
      // 添加到浏览历史
      this.addToHistory(detail);
      
    } catch (error) {
      console.error('获取电影详情失败:', error)
      
      // 错误处理
      if (error.message === 'Movie not found') {
        wx.showToast({
          title: '该电影不存在或已下架',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: '获取数据失败，请稍后重试',
          icon: 'none',
          duration: 2000
        })
      }
      
      // 延迟返回上一页
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 2000);
      
    } finally {
      wx.hideLoading()
    }
  },

  toggleDesc() {
    this.setData({
      showFullDesc: !this.data.showFullDesc
    })
  },

  // 添加到浏览历史
  addToHistory(movieDetail) {
    try {
      // 获取现有历史记录
      let history = wx.getStorageSync('browsing_history') || [];
      
      // 检查是否已经存在该电影
      const existingIndex = history.findIndex(item => item.movie_id === movieDetail.movie_id);
      
      // 如果已存在，先移除
      if (existingIndex > -1) {
        history.splice(existingIndex, 1);
      }
      
      // 添加到历史记录开头
      history.unshift({
        movie_id: movieDetail.movie_id,
        title: movieDetail.title,
        imageUrl: movieDetail.imageUrl,
        rating: movieDetail.rating,
        timestamp: new Date().getTime()
      });
      
      // 限制历史记录最多50条
      if (history.length > 50) {
        history = history.slice(0, 50);
      }
      
      // 保存到本地存储
      wx.setStorageSync('browsing_history', history);
      
    } catch (error) {
      console.error('保存浏览历史失败:', error);
    }
  }
})