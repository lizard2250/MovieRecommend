// pages/detail/detail.js
const app = getApp()
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
    this.checkUserInteractions(id)
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

  },

  fetchDetail(id) {
    wx.showLoading({
      title: '加载中',
    })

    // Mock data for now - would be replaced with a real API call
    setTimeout(() => {
      // Different data based on item type
      const detail = {
        id: id,
        title: id.startsWith('1') || id.startsWith('2') ? '电影名称' + id : '演出名称' + id,
        category: id.startsWith('1') || id.startsWith('2') ? '电影' : '演出',
        imageUrl: 'https://img.mockdata.com/detail' + id + '.jpg',
        rating: '8.7',
        ratingCount: '1.2万',
        year: '2023',
        description: '这是一部非常精彩的作品，融合了悬疑、动作和科幻元素。故事讲述了一个发生在未来世界的冒险，主角通过自己的智慧和勇气，最终战胜了困难，拯救了世界。影片节奏紧凑，特效精良，演员表演出色，是近年来不可多错过的佳作。',
        director: '张导演',
        actors: '李明, 王红, 赵强, 陈小',
        type: '动作/科幻/冒险',
        language: '中文',
        duration: '120分钟',
        venue: id.startsWith('3') ? '北京工人体育馆' : '',
        showDate: id.startsWith('3') ? '2023-09-15 19:30' : '',
        sentimentAnalysis: {
          positive: 75,
          neutral: 20,
          negative: 5
        }
      }

      const comments = [
        {
          id: 1,
          username: '用户A',
          avatar: 'https://img.mockdata.com/avatar1.jpg',
          rating: 4.5,
          content: '非常精彩的一部电影，特效很棒，演员表演到位，推荐观看！',
          time: '2023-08-10'
        },
        {
          id: 2,
          username: '用户B',
          avatar: 'https://img.mockdata.com/avatar2.jpg',
          rating: 5,
          content: '我已经看了三遍了，每次都有新的发现，剧情设计得太巧妙了。',
          time: '2023-08-09'
        },
        {
          id: 3,
          username: '用户C',
          avatar: 'https://img.mockdata.com/avatar3.jpg',
          rating: 4,
          content: '整体不错，就是结尾有点仓促，希望能有续集进一步展开。',
          time: '2023-08-08'
        }
      ]

      const relatedItems = [
        { id: id + '1', title: '相关推荐1', imageUrl: 'https://img.mockdata.com/related1.jpg', rating: '8.5', ratingCount: '9千' },
        { id: id + '2', title: '相关推荐2', imageUrl: 'https://img.mockdata.com/related2.jpg', rating: '8.3', ratingCount: '7千' },
        { id: id + '3', title: '相关推荐3', imageUrl: 'https://img.mockdata.com/related3.jpg', rating: '8.1', ratingCount: '5千' },
        { id: id + '4', title: '相关推荐4', imageUrl: 'https://img.mockdata.com/related4.jpg', rating: '8.0', ratingCount: '3千' }
      ]

      this.setData({
        detail: detail,
        comments: comments,
        relatedItems: relatedItems
      })

      wx.hideLoading()

      // Draw chart with mock data
      this.drawTrendChart()
    }, 1000)
  },

  checkUserInteractions(id) {
    // Check if user has collected or rated this item
    // This would use real storage or API in a real app
    const collectList = wx.getStorageSync('collectList') || []
    const ratingList = wx.getStorageSync('ratingList') || []

    this.setData({
      isCollected: collectList.includes(id),
      hasRated: ratingList.some(item => item.id === id)
    })
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

  toggleCollect() {
    if (!this.checkLogin()) return

    const id = this.data.id
    const isCollected = this.data.isCollected
    
    // This would be a real API call in a production app
    let collectList = wx.getStorageSync('collectList') || []
    
    if (isCollected) {
      collectList = collectList.filter(item => item !== id)
    } else {
      collectList.push(id)
    }
    
    wx.setStorageSync('collectList', collectList)
    
    this.setData({
      isCollected: !isCollected
    })
    
    wx.showToast({
      title: isCollected ? '已取消收藏' : '已加入收藏',
      icon: 'success'
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
      showFullDesc: true
    })
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
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
  }
})