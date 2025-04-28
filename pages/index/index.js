// index.js
const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    hasUserInfo: false,
    userInfo: {},
    banners: [],
    trending: [],
    movies: [],
    shows: [],
    aiRecommendations: []
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    this.fetchHomeData()
  },

  onShow() {
    // Check login status
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        hasUserInfo: true,
        userInfo: userInfo
      })
      this.fetchAIRecommendations()
    }
  },

  async fetchHomeData() {
    wx.showLoading({
      title: '加载中',
    })

    try {
      // 获取正在热映的电影
      const inTheaters = await api.getInTheaters()
      // 获取即将上映的电影
      const comingSoon = await api.getComingSoon()

      // 处理轮播图数据
      const banners = (inTheaters?.subjects || []).slice(0, 3).map(movie => ({
        id: movie.id,
        imageUrl: movie.images.large
      }))

      // 处理热门推荐数据
      const trending = (inTheaters?.subjects || []).slice(0, 4).map(movie => ({
        id: movie.id,
        title: movie.title,
        imageUrl: movie.images.medium,
        rating: movie.rating.average.toFixed(1),
        ratingCount: movie.collect_count + '人评'
      }))

      // 处理热映电影数据
      const movies = (inTheaters?.subjects || []).slice(4, 8).map(movie => ({
        id: movie.id,
        title: movie.title,
        imageUrl: movie.images.medium,
        rating: movie.rating.average.toFixed(1),
        ratingCount: movie.collect_count + '人评'
      }))

      // 处理即将上映的电影数据
      const shows = (comingSoon?.subjects || []).slice(0, 4).map(movie => ({
        id: movie.id,
        title: movie.title,
        imageUrl: movie.images.medium,
        rating: movie.rating.average.toFixed(1),
        ratingCount: movie.collect_count + '人评'
      }))

      this.setData({
        banners,
        trending,
        movies,
        shows
      })
    } catch (error) {
      console.error('获取电影数据失败:', error)
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  async fetchAIRecommendations() {
    try {
      // 获取用户收藏的电影ID列表
      const collectList = wx.getStorageSync('collectList') || []
      
      // 根据用户收藏的电影类型推荐相似电影
      const recommendations = []
      for (const movieId of collectList) {
        const movieDetail = await api.getMovieDetail(movieId)
        // 获取相似电影
        const similarMovies = movieDetail.similar_movies || []
        recommendations.push(...similarMovies.slice(0, 2))
      }

      // 处理推荐数据
      const aiRecommendations = recommendations.map(movie => ({
        id: movie.id,
        title: movie.title,
        imageUrl: movie.images.medium,
        rating: movie.rating.average.toFixed(1),
        ratingCount: movie.collect_count + '人评'
      }))

      this.setData({
        aiRecommendations: aiRecommendations.slice(0, 3) // 只显示前3个推荐
      })
    } catch (error) {
      console.error('获取推荐数据失败:', error)
    }
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  navigateToCategory(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/category/category?type=${type}`
    })
  },

  navigateToUser() {
    wx.switchTab({
      url: '/pages/user/user'
    })
  }
})
