// index.js
const app = getApp()

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

  fetchHomeData() {
    wx.showLoading({
      title: '加载中',
    })

    // Mock data for now
    // In real app, use wx.request to fetch from API
    setTimeout(() => {
      this.setData({
        banners: [
          { id: 1, imageUrl: 'https://img.mockdata.com/banner1.jpg' },
          { id: 2, imageUrl: 'https://img.mockdata.com/banner2.jpg' },
          { id: 3, imageUrl: 'https://img.mockdata.com/banner3.jpg' }
        ],
        trending: [
          { id: 101, title: '流浪地球2', imageUrl: 'https://img.mockdata.com/movie1.jpg', rating: '9.1', ratingCount: '1.2万' },
          { id: 102, title: '满江红', imageUrl: 'https://img.mockdata.com/movie2.jpg', rating: '8.7', ratingCount: '8千' },
          { id: 103, title: '独行月球', imageUrl: 'https://img.mockdata.com/movie3.jpg', rating: '8.5', ratingCount: '1.5万' },
          { id: 104, title: '长空之王', imageUrl: 'https://img.mockdata.com/movie4.jpg', rating: '8.3', ratingCount: '6千' }
        ],
        movies: [
          { id: 201, title: '孤注一掷', imageUrl: 'https://img.mockdata.com/movie5.jpg', rating: '8.0', ratingCount: '7千' },
          { id: 202, title: '消失的她', imageUrl: 'https://img.mockdata.com/movie6.jpg', rating: '7.8', ratingCount: '5千' },
          { id: 203, title: '超能一家人', imageUrl: 'https://img.mockdata.com/movie7.jpg', rating: '7.5', ratingCount: '4千' },
          { id: 204, title: '八角笼中', imageUrl: 'https://img.mockdata.com/movie8.jpg', rating: '8.2', ratingCount: '3千' }
        ],
        shows: [
          { id: 301, title: '周杰伦2023巡回演唱会', imageUrl: 'https://img.mockdata.com/show1.jpg', rating: '9.5', ratingCount: '2万' },
          { id: 302, title: '《猫》音乐剧', imageUrl: 'https://img.mockdata.com/show2.jpg', rating: '9.0', ratingCount: '1万' },
          { id: 303, title: '《狮子王》音乐剧', imageUrl: 'https://img.mockdata.com/show3.jpg', rating: '9.2', ratingCount: '1.5万' },
          { id: 304, title: '五月天2023演唱会', imageUrl: 'https://img.mockdata.com/show4.jpg', rating: '9.3', ratingCount: '1.8万' }
        ]
      })
      wx.hideLoading()
    }, 1000)
  },

  fetchAIRecommendations() {
    // This would be a real API call with user ID token
    setTimeout(() => {
      this.setData({
        aiRecommendations: [
          { id: 401, title: '封神第一部', imageUrl: 'https://img.mockdata.com/movie9.jpg', rating: '8.4', ratingCount: '9千' },
          { id: 402, title: '芭比', imageUrl: 'https://img.mockdata.com/movie10.jpg', rating: '8.2', ratingCount: '7千' },
          { id: 403, title: '年会不能停', imageUrl: 'https://img.mockdata.com/movie11.jpg', rating: '8.0', ratingCount: '5千' }
        ]
      })
    }, 1500)
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
