// pages/search/search.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword: '',
    searchHistory: [],
    hotSearches: [
      '流浪地球2', '满江红', '周杰伦', '音乐剧', '独行月球', 
      '五月天演唱会', '封神第一部', '奥本海默', '巴比'
    ],
    showResults: false,
    isLoading: false,
    noMore: false,
    searchResults: [],
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
        searchKeyword: options.keyword,
        autoFocus: false
      })
      this.search()
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

  onInputChange(e) {
    this.setData({
      searchKeyword: e.detail.value
    })
    
    // Clear results when input is cleared
    if (e.detail.value === '') {
      this.setData({
        showResults: false,
        searchResults: [],
        aiSuggestions: []
      })
    }
    
    // Show AI suggestions when typing
    if (e.detail.value.length > 1) {
      this.getAISuggestions(e.detail.value)
    } else {
      this.setData({
        aiSuggestions: []
      })
    }
  },

  search() {
    const keyword = this.data.searchKeyword.trim()
    if (!keyword) return
    
    // Save to search history
    this.saveSearchHistory(keyword)
    
    this.setData({
      isLoading: true,
      showResults: true,
      searchResults: [],
      page: 1,
      noMore: false,
      aiSuggestions: []
    })
    
    this.fetchSearchResults(keyword, this.data.currentTab, 1)
  },

  loadMoreResults() {
    const nextPage = this.data.page + 1
    
    this.setData({
      isLoading: true,
      page: nextPage
    })
    
    this.fetchSearchResults(this.data.searchKeyword, this.data.currentTab, nextPage)
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
          imageUrl: 'https://img.mockdata.com/movie1.jpg',
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
          imageUrl: 'https://img.mockdata.com/movie2.jpg',
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
          imageUrl: 'https://img.mockdata.com/show1.jpg',
          year: '2023',
          rating: '9.5',
          ratingCount: '2万',
          description: '周杰伦2023"嘉年华"世界巡回演唱会，带来全新舞台和歌单。'
        },
        {
          id: '303',
          title: '《狮子王》音乐剧',
          category: '音乐剧',
          imageUrl: 'https://img.mockdata.com/show3.jpg',
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
        searchResults: page === 1 ? results : [...this.data.searchResults, ...results],
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
        searchResults: [],
        isLoading: true
      })
      
      this.fetchSearchResults(this.data.searchKeyword, tab, 1)
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
      searchKeyword: keyword
    })
    
    this.search()
  },

  clearSearch() {
    this.setData({
      searchKeyword: '',
      showResults: false,
      searchResults: [],
      aiSuggestions: []
    })
  },

  loadSearchHistory() {
    const history = wx.getStorageSync('searchHistory') || []
    this.setData({
      searchHistory: history
    })
  },

  saveSearchHistory(keyword) {
    let history = wx.getStorageSync('searchHistory') || []
    
    // Remove duplicate if exists
    history = history.filter(item => item !== keyword)
    
    // Add to beginning of array
    history.unshift(keyword)
    
    // Limit to 10 items
    if (history.length > 10) {
      history = history.slice(0, 10)
    }
    
    wx.setStorageSync('searchHistory', history)
    
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
  }
})