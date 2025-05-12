// pages/detail/detail.js
const app = getApp()
const api = require('../../utils/api')
// This would be replaced with an actual chart library in a real app
import * as mockChart from '../../utils/mock-chart.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    detail: {},
    comments: [],
    relatedItems: [],
    isCollected: false,
    hasRated: false,
    showRatingDialog: false,
    currentRating: 0,
    userComment: '',
    showFullDesc: false,
    ratingHints: ['很差', '较差', '还行', '推荐', '力荐']
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
    this.checkCollection(id)
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
      detail.imageUrl = `http://47.121.24.255/mobile/movie/photo/${detail.movie_id}`
      
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

  checkCollection(id) {
    const collections = wx.getStorageSync('collections') || []
    this.setData({
      isCollected: collections.includes(id)
    })
  },

  toggleCollection() {
    if (!this.checkLogin()) return

    const id = this.data.id
    let collections = wx.getStorageSync('collections') || []
    const isCollected = collections.includes(id)

    if (isCollected) {
      collections = collections.filter(item => item !== id)
      wx.showToast({
        title: '已取消收藏',
        icon: 'success'
      })
    } else {
      collections.push(id)
      wx.showToast({
        title: '已收藏',
        icon: 'success'
      })
    }

    wx.setStorageSync('collections', collections)
    this.setData({
      isCollected: !isCollected
    })
  },

  checkLogin() {
    if (!wx.getStorageSync('userInfo')) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return false
    }
    return true
  },

  drawTrendChart() {
    // This would use a real chart library in a real app
    mockChart.drawLineChart('trendChart', {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
      series: [{
        name: '热度',
        data: [50, 65, 60, 80, 70, 85, 90]
      }]
    })
  },

  toggleRating() {
    if (!this.checkLogin()) return

    this.setData({
      showRatingDialog: true,
      currentRating: 0,
      userComment: ''
    })
  },

  closeRatingDialog() {
    this.setData({
      showRatingDialog: false
    })
  },

  selectRating(e) {
    const rating = e.currentTarget.dataset.rating
    this.setData({
      currentRating: rating
    })
  },

  onCommentInput(e) {
    this.setData({
      userComment: e.detail.value
    })
  },

  submitRating() {
    if (this.data.currentRating === 0) {
      wx.showToast({
        title: '请选择评分',
        icon: 'none'
      })
      return
    }

    // This would be a real API call in a production app
    const ratingData = {
      id: this.data.id,
      rating: this.data.currentRating,
      comment: this.data.userComment,
      date: new Date().toISOString().split('T')[0]
    }
    
    let ratingList = wx.getStorageSync('ratingList') || []
    const existingIndex = ratingList.findIndex(item => item.id === this.data.id)
    
    if (existingIndex !== -1) {
      ratingList[existingIndex] = ratingData
    } else {
      ratingList.push(ratingData)
    }
    
    wx.setStorageSync('ratingList', ratingList)
    
    this.setData({
      showRatingDialog: false,
      hasRated: true
    })
    
    wx.showToast({
      title: '评分成功',
      icon: 'success'
    })
  },

  navigateToComments() {
    // Would navigate to a comments page in a real app
    wx.showToast({
      title: '查看全部评论',
      icon: 'none'
    })
  },

  share() {
    // Would open share dialog in a real app
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    })
  },

  toggleDescription() {
    this.setData({
      showFullDesc: !this.data.showFullDesc
    })
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
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