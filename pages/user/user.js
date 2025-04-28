// pages/user/user.js
const app = getApp()
import * as mockChart from '../../utils/mock-chart.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    userInfo: {},
    userId: '',
    stats: {
      ratingCount: 0,
      collectCount: 0,
      commentCount: 0
    },
    userPreferences: {
      tags: []
    },
    recentItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.checkLoginStatus()
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
    // Refresh data when page is shown
    this.checkLoginStatus()
    if (this.data.hasUserInfo) {
      this.loadUserData()
    }
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
    if (this.data.hasUserInfo) {
      this.loadUserData(() => {
        wx.stopPullDownRefresh()
      })
    } else {
      wx.stopPullDownRefresh()
    }
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

  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        hasUserInfo: true,
        userInfo: userInfo,
        userId: this.generateUserId(userInfo.nickName)
      })
    } else {
      this.setData({
        hasUserInfo: false,
        userInfo: {},
        userId: ''
      })
    }
  },

  generateUserId(nickname) {
    // In a real app this would be a server-assigned user ID
    // For demo purposes, we create one based on the nickname
    return 'U' + Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  },

  loadUserData(callback) {
    wx.showLoading({
      title: '加载中',
    })

    // Mock loading user data - would be API calls in a real app
    setTimeout(() => {
      // Get collection and rating counts from storage
      const collectList = wx.getStorageSync('collectList') || []
      const ratingList = wx.getStorageSync('ratingList') || []
      
      // Mock data
      this.setData({
        stats: {
          ratingCount: ratingList.length,
          collectCount: collectList.length,
          commentCount: Math.floor(ratingList.length * 0.7) // Assume 70% of ratings have comments
        },
        userPreferences: {
          tags: ['科幻', '动作', '悬疑', '剧情', '音乐剧']
        },
        recentItems: [
          { id: '101', title: '流浪地球2', imageUrl: 'https://picsum.photos/300/450?random=101', rating: '9.1', ratingCount: '1.2万' },
          { id: '302', title: '《猫》音乐剧', imageUrl: 'https://picsum.photos/300/450?random=302', rating: '9.0', ratingCount: '1万' },
          { id: '203', title: '超能一家人', imageUrl: 'https://picsum.photos/300/450?random=203', rating: '7.5', ratingCount: '4千' }
        ]
      })

      // Draw preference chart
      this.drawPreferenceChart()

      wx.hideLoading()
      if (callback) callback()
    }, 1000)
  },

  drawPreferenceChart() {
    // Mock chart data
    const data = {
      categories: ['动作', '科幻', '喜剧', '剧情', '悬疑'],
      series: [{
        name: '偏好程度',
        data: [85, 90, 60, 75, 80]
      }]
    }
    
    mockChart.drawBarChart('preferenceChart', data)
  },

  login() {
    // In a real app, this would use wx.login() and server authentication
    wx.showLoading({
      title: '登录中',
    })
    
    setTimeout(() => {
      // Mock user data
      const mockUserInfo = {
        nickName: '影评达人',
        avatarUrl: 'https://via.placeholder.com/100x100/607D8B/FFFFFF?text=用户',
      }
      
      wx.setStorageSync('userInfo', mockUserInfo)
      
      this.setData({
        hasUserInfo: true,
        userInfo: mockUserInfo,
        userId: this.generateUserId(mockUserInfo.nickName)
      })
      
      // Load user data after login
      this.loadUserData()
      
      wx.hideLoading()
      
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })
    }, 1000)
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // Clear user data
          wx.removeStorageSync('userInfo')
          
          this.setData({
            hasUserInfo: false,
            userInfo: {},
            userId: '',
            stats: {
              ratingCount: 0,
              collectCount: 0,
              commentCount: 0
            },
            userPreferences: {
              tags: []
            },
            recentItems: []
          })
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  navigateToCollections() {
    // These would navigate to appropriate pages in a real app
    if (!this.checkLogin()) return
    wx.showToast({
      title: '我的收藏功能开发中',
      icon: 'none'
    })
  },

  navigateToRatings() {
    if (!this.checkLogin()) return
    wx.showToast({
      title: '我的评分功能开发中',
      icon: 'none'
    })
  },

  navigateToHistory() {
    if (!this.checkLogin()) return
    wx.showToast({
      title: '浏览历史功能开发中',
      icon: 'none'
    })
  },

  navigateToSettings() {
    wx.showToast({
      title: '设置功能开发中',
      icon: 'none'
    })
  },

  showFeedback() {
    wx.showToast({
      title: '意见反馈功能开发中',
      icon: 'none'
    })
  },

  showAbout() {
    wx.showToast({
      title: '关于我们功能开发中',
      icon: 'none'
    })
  },

  checkLogin() {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return false
    }
    return true
  }
})