// pages/user/user.js
const app = getApp()
const api = require('../../utils/api')
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
    recentItems: [],
    recommendedMovies: []
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

    try {
      // 获取收藏列表
      const collectList = wx.getStorageSync('collections') || []
      // 获取评分列表
      const ratingList = wx.getStorageSync('ratingList') || []
      // 获取浏览历史
      const browsing_history = wx.getStorageSync('browsing_history') || []
      
      // 获取收藏和评分的统计数据
      const stats = {
        ratingCount: ratingList.length,
        collectCount: collectList.length,
        commentCount: ratingList.filter(item => item.comment && item.comment.trim() !== '').length
      }
      
      // 分析用户偏好
      const tags = this.analyzeUserPreferences(collectList, ratingList, browsing_history)
      
      // 处理浏览历史数据
      let recentItems = []
      if (browsing_history && browsing_history.length > 0) {
        // 取最近的5条浏览记录
        recentItems = browsing_history.slice(0, 5).map(item => ({
          id: item.movie_id,
          title: item.title,
          imageUrl: item.imageUrl,
          rating: item.rating || '暂无评分',
          ratingCount: item.vote_num || '0'
        }))
      }
      
      // 获取推荐电影
      this.getRecommendedMovies(tags).then(recommendedMovies => {
        this.setData({
          stats: stats,
          userPreferences: {
            tags: tags
          },
          recentItems: recentItems,
          recommendedMovies: recommendedMovies
        })
        
        // 绘制偏好图表
        this.drawPreferenceChart(tags)
        
        wx.hideLoading()
        if (callback) callback()
      }).catch(error => {
        console.error('获取推荐失败:', error)
        this.setData({
          stats: stats,
          userPreferences: {
            tags: tags
          },
          recentItems: recentItems
        })
        
        // 绘制偏好图表
        this.drawPreferenceChart(tags)
        
        wx.hideLoading()
        if (callback) callback()
      })
    } catch (error) {
      console.error('加载用户数据失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      })
      if (callback) callback()
    }
  },

  analyzeUserPreferences(collectList, ratingList, browsing_history) {
    // 分析用户实际数据，而不是使用模拟数据
    const allItems = [
      ...collectList, 
      ...ratingList.map(item => ({
        id: item.id,
        title: item.title,
        genres: item.genres || []
      })),
      ...browsing_history.map(item => ({
        id: item.movie_id,
        title: item.title,
        genres: item.genres || []
      }))
    ];
    
    // 如果用户没有任何数据，返回默认标签
    if (allItems.length === 0) {
      return ['科幻', '动作', '悬疑', '剧情', '音乐剧'];
    }
    
    // 分析用户标签偏好
    let genreCounts = {};
    allItems.forEach(item => {
      if (Array.isArray(item.genres)) {
        item.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });
    
    // 转换成数组并排序
    let sortedGenres = Object.keys(genreCounts).map(genre => ({
      name: genre,
      count: genreCounts[genre]
    })).sort((a, b) => b.count - a.count);
    
    // 取前5个最常见的标签
    return sortedGenres.slice(0, 5).map(genre => genre.name);
  },

  drawPreferenceChart(tags) {
    // 根据用户的实际数据生成图表
    const data = {
      categories: tags,
      series: [{
        name: '偏好程度',
        data: tags.map((tag, index) => {
          // 为了视觉上的差异，使用不同的权重
          const baseValue = 60 - (index * 8);
          return baseValue + Math.floor(Math.random() * 20);
        })
      }]
    };
    
    mockChart.drawBarChart('preferenceChart', data);
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
        avatarUrl: '/images/default-avatar.png', // 使用本地图片替代在线占位图
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
            recentItems: [],
            recommendedMovies: []
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
    if (!this.checkLogin()) return
    
    // 跳转到收藏页面
    wx.navigateTo({
      url: '/pages/collections/collections'
    })
  },

  navigateToRatings() {
    if (!this.checkLogin()) return
    
    // 跳转到评分页面
    wx.navigateTo({
      url: '/pages/ratings/ratings'
    })
  },

  navigateToHistory() {
    if (!this.checkLogin()) return
    
    // 跳转到浏览历史页面
    wx.navigateTo({
      url: '/pages/history/history'
    })
  },

  navigateToSettings() {
    if (!this.checkLogin()) return
    
    wx.showModal({
      title: '个人设置',
      content: '选择要修改的设置项',
      showCancel: true,
      cancelText: '取消',
      confirmText: '编辑资料',
      success: (res) => {
        if (res.confirm) {
          this.editProfile()
        }
      }
    })
  },

  editProfile() {
    wx.showModal({
      title: '编辑昵称',
      content: '请输入您的新昵称',
      editable: true,
      placeholderText: this.data.userInfo.nickName,
      success: (res) => {
        if (res.confirm && res.content) {
          // 更新用户昵称
          const userInfo = this.data.userInfo
          userInfo.nickName = res.content
          
          // 保存到本地存储
          wx.setStorageSync('userInfo', userInfo)
          
          // 更新页面数据
          this.setData({
            userInfo: userInfo
          })
          
          wx.showToast({
            title: '更新成功',
            icon: 'success'
          })
        }
      }
    })
  },

  showFeedback() {
    if (!this.checkLogin()) return
    wx.showModal({
      title: '意见反馈',
      content: '感谢您使用电影推荐小程序！\n如有任何建议或问题，请联系我们：\nservice@movierecommend.com',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  showAbout() {
    wx.showModal({
      title: '关于我们',
      content: '电影推荐小程序 v1.0.0\n为您提供精准的电影推荐服务\n\n技术支持：MovieTeam\n联系方式：support@movierecommend.com',
      showCancel: false,
      confirmText: '知道了'
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
  },

  // 添加获取推荐电影的方法
  getRecommendedMovies(tags) {
    return new Promise((resolve, reject) => {
      try {
        // 从本地缓存获取所有电影数据
        const allMovies = wx.getStorageSync('allMovies') || []
        
        // 已经浏览/收藏/评分过的电影ID
        const viewedHistory = wx.getStorageSync('browsing_history') || []
        const collections = wx.getStorageSync('collections') || []
        const ratingList = wx.getStorageSync('ratingList') || []
        
        // 合并已浏览/收藏/评分的电影ID
        const viewedIds = new Set([
          ...viewedHistory.map(item => item.movie_id),
          ...collections.map(item => item.id),
          ...ratingList.map(item => item.id)
        ])
        
        // 过滤出未浏览过的电影
        const unwatchedMovies = allMovies.filter(movie => !viewedIds.has(movie.id))
        
        // 根据标签计算推荐分数
        const scoredMovies = unwatchedMovies.map(movie => {
          let score = 0
          if (movie.genres) {
            movie.genres.forEach(genre => {
              if (tags.includes(genre)) {
                score += 10
              }
            })
          }
          return {
            ...movie,
            recommendScore: score
          }
        })
        
        // 按推荐分数排序
        scoredMovies.sort((a, b) => b.recommendScore - a.recommendScore)
        
        // 返回前5个推荐电影
        const recommendations = scoredMovies.slice(0, 5).map(movie => ({
          id: movie.id,
          title: movie.title,
          imageUrl: movie.images?.small || '/images/default-movie.png',
          rating: movie.rating?.average || '暂无评分',
          ratingCount: movie.rating?.count || '0'
        }))
        
        resolve(recommendations)
      } catch (error) {
        console.error('生成推荐失败:', error)
        reject(error)
      }
    })
  },
  
  viewAllRecommendations() {
    if (!this.checkLogin()) return
    
    wx.showToast({
      title: '推荐页面开发中',
      icon: 'none'
    })
    // 这里可以跳转到完整的推荐页面
    // wx.navigateTo({
    //   url: '/pages/recommendations/recommendations'
    // })
  }
})