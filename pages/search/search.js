// pages/search/search.js
const app = getApp()
const api = require('../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: '',
    searchHistory: [],
    results: [],
    loading: false,
    hotSearches: [
      '流浪地球2', '满江红', '周杰伦', '音乐剧', '独行月球', 
      '五月天演唱会', '封神第一部', '奥本海默', '巴比'
    ],
    showResults: false,
    isLoading: false,
    noMore: false,
    resultCount: 0,
    currentTab: 'all',
    page: 1,
    pageSize: 10,
    aiSuggestions: [],
    autoFocus: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // If keyword is passed from another page
    if (options.keyword) {
      this.setData({
        searchText: options.keyword,
        autoFocus: false
      })
      this.onSearch({
        detail: { value: options.keyword }
      })
    }
    
    // Load search history
    this.loadSearchHistory()
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
    if (this.data.showResults && !this.data.isLoading && !this.data.noMore) {
      this.loadMoreResults()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onSearchInput(e) {
    this.setData({
      searchText: e.detail.value
    })

    // 如果输入框为空，清空搜索结果
    if (!e.detail.value) {
      this.setData({
        results: []
      })
    }
  },

  async onSearch(e) {
    const keyword = e.detail.value || this.data.searchText
    if (!keyword) return

    // 显示加载状态
    this.setData({
      loading: true,
      results: [] // 清空之前的结果
    })

    try {
      // 调用搜索API
      const results = await api.searchMovies(keyword)
      
      console.log(`获取到搜索结果: ${results.length}条记录`)
      
      // 处理搜索结果
      const processedResults = results.map(movie => ({
        ...movie,
        imageUrl: movie.imageUrl || api.getMoviePoster(movie.movie_id)
      }))

      // 更新搜索结果
      this.setData({
        results: processedResults,
        loading: false
      })

      // 保存搜索历史
      this.saveSearchHistory(keyword)
    } catch (error) {
      console.error('搜索失败:', error)
      wx.showToast({
        title: '搜索失败',
        icon: 'none'
      })
      this.setData({
        loading: false
      })
    }
  },

  loadMoreResults() {
    const nextPage = this.data.page + 1
    
    this.setData({
      isLoading: true,
      page: nextPage
    })
    
    this.fetchSearchResults(this.data.searchText, this.data.currentTab, nextPage)
  },

  fetchSearchResults(keyword, tab, page) {
    // This would be a real API call in a production app
    setTimeout(() => {
      // Create some mock results
      let results = []
      
      // Movie results
      const movieResults = [
        {
          id: '101',
          title: '流浪地球2',
          category: '电影',
          imageUrl: 'https://via.placeholder.com/300x450/4CAF50/FFFFFF?text=流浪地球2',
          year: '2023',
          director: '郭帆',
          rating: '9.1',
          ratingCount: '1.2万',
          description: '讲述了人类为了应对太阳即将毁灭的危机，组织起宏大的太空计划，试图带着地球一起逃离太阳系的故事。'
        },
        {
          id: '102',
          title: '满江红',
          category: '电影',
          imageUrl: 'https://via.placeholder.com/300x450/FF9800/FFFFFF?text=满江红',
          year: '2023',
          director: '张艺谋',
          rating: '8.7',
          ratingCount: '8千',
          description: '以南宋绍兴年间为背景，讲述了一个关于奸臣当道、忠义两难的故事。'
        }
      ]
      
      // Show results
      const showResults = [
        {
          id: '301',
          title: '周杰伦2023巡回演唱会',
          category: '演唱会',
          imageUrl: 'https://via.placeholder.com/300x450/9C27B0/FFFFFF?text=周杰伦演唱会',
          year: '2023',
          rating: '9.5',
          ratingCount: '2万',
          description: '周杰伦2023"嘉年华"世界巡回演唱会，带来全新舞台和歌单。'
        },
        {
          id: '303',
          title: '《狮子王》音乐剧',
          category: '音乐剧',
          imageUrl: 'https://via.placeholder.com/300x450/FF5722/FFFFFF?text=狮子王音乐剧',
          year: '2023',
          rating: '9.2',
          ratingCount: '1.5万',
          description: '迪士尼经典音乐剧《狮子王》中文版，震撼视听体验。'
        }
      ]
      
      // Filter based on tab and keyword
      if (tab === 'all' || tab === 'movie') {
        results = results.concat(movieResults.filter(item => 
          item.title.includes(keyword) || 
          item.director?.includes(keyword) ||
          item.description.includes(keyword)
        ))
      }
      
      if (tab === 'all' || tab === 'show') {
        results = results.concat(showResults.filter(item => 
          item.title.includes(keyword) || 
          item.description.includes(keyword)
        ))
      }
      
      // Add a random factor to simulate different result sets
      if (page > 1) {
        // For pagination demo, add suffix to titles
        results = results.map((item, index) => ({
          ...item,
          id: item.id + page,
          title: item.title + ' ' + (index + 1)
        }))
      }
      
      // Simulate having more results for the first few pages only
      const noMore = page >= 3
      
      this.setData({
        results: page === 1 ? results : [...this.data.results, ...results],
        resultCount: 20, // Mock total count
        isLoading: false,
        noMore: noMore
      })
    }, 1000)
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    
    if (tab !== this.data.currentTab) {
      this.setData({
        currentTab: tab,
        page: 1,
        noMore: false,
        results: [],
        isLoading: true
      })
      
      this.fetchSearchResults(this.data.searchText, tab, 1)
    }
  },

  getAISuggestions(keyword) {
    // This would be a real API call to an AI suggestion service
    setTimeout(() => {
      // Mock AI suggestions based on keyword
      let suggestions = []
      
      if (keyword.includes('电影')) {
        suggestions = ['近期热门电影', '科幻电影', '动作电影']
      } else if (keyword.includes('演唱会')) {
        suggestions = ['周杰伦演唱会', '五月天演唱会', 'TFBOYS演唱会']
      } else if (keyword.includes('剧')) {
        suggestions = ['音乐剧门票', '话剧推荐', '百老汇音乐剧']
      } else {
        // Random suggestions based on characters in keyword
        if (keyword.length > 0) {
          const char = keyword.charAt(0)
          if (/[a-zA-Z]/.test(char)) {
            suggestions = ['Avatar', 'Avengers', 'Alien']
          } else {
            suggestions = [keyword + '电影', keyword + '演唱会', '最新' + keyword + '作品']
          }
        }
      }
      
      this.setData({
        aiSuggestions: suggestions
      })
    }, 300)
  },

  useHistoryKeyword(e) {
    const keyword = e.currentTarget.dataset.keyword
    
    this.setData({
      searchText: keyword
    })
    
    this.onSearch({
      detail: { value: keyword }
    })
  },

  clearSearch() {
    this.setData({
      searchText: '',
      results: []
    })
  },

  loadSearchHistory() {
    const history = wx.getStorageSync('searchHistory') || []
    this.setData({
      searchHistory: history
    })
  },

  saveSearchHistory(keyword) {
    if (!keyword) return
    
    let history = wx.getStorageSync('searchHistory') || []
    
    // 如果关键词已存在，先移除
    history = history.filter(item => item !== keyword)
    
    // 将新关键词添加到开头
    history.unshift(keyword)
    
    // 限制历史记录最多10条
    if (history.length > 10) {
      history = history.slice(0, 10)
    }
    
    // 保存到本地
    wx.setStorageSync('searchHistory', history)
    
    // 更新页面数据
    this.setData({
      searchHistory: history
    })
  },

  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定要清除搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('searchHistory')
          this.setData({
            searchHistory: []
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

  goBack() {
    wx.navigateBack()
  },

  onHistoryTap(e) {
    const keyword = e.currentTarget.dataset.keyword
    console.log('点击历史搜索:', keyword)
    
    this.setData({
      searchText: keyword
    })
    
    this.onSearch({
      detail: { value: keyword }
    })
  }
})