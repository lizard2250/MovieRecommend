// index.js
const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    hasUserInfo: false,
    userInfo: {},
    banners: [],
    nowPlaying: [],
    popular: [],
    upcoming: [],
    recommended: []
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
      this.fetchRecommendations()
    }
  },

  async fetchHomeData() {
    wx.showLoading({
      title: '加载中',
    })

    try {
      // 获取正在热映的电影
      const movies = await api.getNowPlaying(1)
      
      if (movies && movies.length > 0) {
        // 处理轮播图数据 - 使用前3部电影
        const banners = movies.slice(0, 3).map(movie => ({
          id: movie.movie_id,
          imageUrl: api.getMoviePoster(movie.movie_id),
          title: movie.title
        }))

        // 处理正在热映数据
        const nowPlaying = movies.map(movie => ({
          id: movie.movie_id,
          title: movie.title,
          imageUrl: api.getMoviePoster(movie.movie_id),
          rating: movie.rating || '暂无评分',
          vote_num: movie.vote_num || 0
        }))

        // 获取高分电影（按评分排序）
        const popular = [...movies]
          .sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
          .slice(0, 6)
          .map(movie => ({
            id: movie.movie_id,
            title: movie.title,
            imageUrl: api.getMoviePoster(movie.movie_id),
            rating: movie.rating || '暂无评分',
            vote_num: movie.vote_num || 0
          }))

        this.setData({
          banners,
          nowPlaying,
          popular
        })
      }
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

  async fetchRecommendations() {
    try {
      // 获取用户收藏的电影列表
      const collections = wx.getStorageSync('collections') || []
      
      if (collections.length > 0) {
        // 获取收藏电影的详细信息
        const recommendedMovies = []
        for (const movieId of collections.slice(0, 3)) {
          try {
            const movie = await api.getMovieDetail(movieId)
            if (movie) {
              recommendedMovies.push({
                id: movie.movie_id,
                title: movie.title,
                imageUrl: api.getMoviePoster(movie.movie_id),
                rating: movie.rating || '暂无评分',
                vote_num: movie.vote_num || 0
              })
            }
          } catch (err) {
            console.error(`获取电影 ${movieId} 详情失败:`, err)
          }
        }

        this.setData({
          recommended: recommendedMovies
        })
      }
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

  navigateToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  navigateToUser() {
    wx.switchTab({
      url: '/pages/user/user'
    })
  }
})
