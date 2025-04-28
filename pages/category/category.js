// pages/category/category.js
const api = require('../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryTitle: '分类浏览',
    currentTab: 'all',
    sortBy: 'default',
    viewMode: 'grid',
    items: [],
    isLoading: false,
    noMore: false,
    page: 1,
    pageSize: 20,
    showFilter: false,
    filterOptions: {
      genres: [],
      year: '',
      minRating: ''
    },
    allGenres: ['动作', '科幻', '悬疑', '喜剧', '爱情', '动画', '音乐剧', '话剧', '演唱会', '舞蹈', '戏曲'],
    allYears: ['2023', '2022', '2021', '2020', '2019', '2018', '更早'],
    allRatings: ['9', '8', '7', '6', '5'],
    type: 'movie', // movie or show
    movies: [],
    shows: [],
    loading: false,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.type) {
      this.setData({
        type: options.type
      })
    }
    this.loadData()
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
    this.setData({
      page: 1,
      noMore: false,
      items: []
    })
    this.loadData(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.loadData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  getTabTitle(tab) {
    const titles = {
      'all': '全部',
      'movie': '电影',
      'show': '演出',
      'trending': '热门推荐',
      'upcoming': '即将上映'
    }
    return titles[tab] || '分类浏览'
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    if (tab !== this.data.currentTab) {
      this.setData({
        currentTab: tab,
        categoryTitle: this.getTabTitle(tab),
        page: 1,
        noMore: false,
        items: [],
        isLoading: true
      })
      this.loadData()
    }
  },

  sortByOption(e) {
    const sort = e.currentTarget.dataset.sort
    if (sort !== this.data.sortBy) {
      this.setData({
        sortBy: sort,
        page: 1,
        noMore: false,
        items: [],
        isLoading: true
      })
      this.loadData()
    }
  },

  toggleViewMode() {
    this.setData({
      viewMode: this.data.viewMode === 'grid' ? 'list' : 'grid'
    })
  },

  toggleFilter() {
    this.setData({
      showFilter: !this.data.showFilter
    })
  },

  toggleGenreFilter(e) {
    const genre = e.currentTarget.dataset.genre
    let genres = [...this.data.filterOptions.genres]
    
    if (genres.includes(genre)) {
      genres = genres.filter(item => item !== genre)
    } else {
      genres.push(genre)
    }
    
    this.setData({
      'filterOptions.genres': genres
    })
  },

  setYearFilter(e) {
    const year = e.currentTarget.dataset.year
    
    this.setData({
      'filterOptions.year': this.data.filterOptions.year === year ? '' : year
    })
  },

  setRatingFilter(e) {
    const rating = e.currentTarget.dataset.rating
    
    this.setData({
      'filterOptions.minRating': this.data.filterOptions.minRating === rating ? '' : rating
    })
  },

  resetFilters() {
    this.setData({
      filterOptions: {
        genres: [],
        year: '',
        minRating: ''
      }
    })
  },

  applyFilters() {
    this.setData({
      showFilter: false,
      page: 1,
      noMore: false,
      items: [],
      isLoading: true
    })
    this.loadData()
  },

  async loadData() {
    if (this.data.loading || !this.data.hasMore) return

    this.setData({ loading: true })
    wx.showLoading({ title: '加载中' })

    try {
      let data
      if (this.data.type === 'movie') {
        // 获取正在热映的电影
        data = await api.getInTheaters()
      } else {
        // 获取即将上映的电影
        data = await api.getComingSoon()
      }

      const items = data.subjects.map(movie => ({
        id: movie.id,
        title: movie.title,
        imageUrl: movie.images.medium,
        rating: movie.rating.average.toFixed(1),
        ratingCount: movie.collect_count + '人评',
        year: movie.year,
        director: movie.directors[0]?.name || '未知',
        category: movie.genres.join(' / ')
      }))

      if (this.data.type === 'movie') {
        this.setData({
          movies: [...this.data.movies, ...items],
          hasMore: items.length > 0,
          page: this.data.page + 1
        })
      } else {
        this.setData({
          shows: [...this.data.shows, ...items],
          hasMore: items.length > 0,
          page: this.data.page + 1
        })
      }
    } catch (error) {
      console.error('获取数据失败:', error)
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
      wx.hideLoading()
    }
  },

  switchType(e) {
    const type = e.currentTarget.dataset.type
    if (type === this.data.type) return

    this.setData({
      type,
      movies: [],
      shows: [],
      page: 1,
      hasMore: true
    })
    this.loadData()
  },

  switchViewMode(e) {
    const mode = e.currentTarget.dataset.mode
    this.setData({
      viewMode: mode
    })
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  }
})