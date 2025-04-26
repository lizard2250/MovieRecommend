// pages/category/category.js
const app = getApp()

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
    allRatings: ['9', '8', '7', '6', '5']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // Set initial type from options
    if (options.type) {
      const tab = options.type
      this.setData({
        currentTab: tab,
        categoryTitle: this.getTabTitle(tab)
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
    if (!this.data.isLoading && !this.data.noMore) {
      this.loadMoreData()
    }
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

  loadData(callback) {
    this.setData({
      isLoading: true
    })

    // This would be a real API call in a production app
    setTimeout(() => {
      const tab = this.data.currentTab
      const sortBy = this.data.sortBy
      const filterOptions = this.data.filterOptions
      
      // Generate mock data
      let items = []
      
      // Movie data
      const movieItems = [
        {
          id: '101',
          title: '流浪地球2',
          category: '电影',
          imageUrl: 'https://img.mockdata.com/movie1.jpg',
          year: '2023',
          director: '郭帆',
          rating: '9.1',
          ratingCount: '1.2万',
          description: '讲述了人类为了应对太阳即将毁灭的危机，组织起宏大的太空计划，试图带着地球一起逃离太阳系的故事。',
          genres: ['科幻', '动作', '冒险']
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
          description: '以南宋绍兴年间为背景，讲述了一个关于奸臣当道、忠义两难的故事。',
          genres: ['悬疑', '剧情', '动作']
        },
        {
          id: '103',
          title: '独行月球',
          category: '电影',
          imageUrl: 'https://img.mockdata.com/movie3.jpg',
          year: '2022',
          director: '张吃鱼',
          rating: '8.5',
          ratingCount: '1.5万',
          description: '讲述了航天员独自在月球生存并寻找返回地球方法的故事。',
          genres: ['科幻', '喜剧']
        },
        {
          id: '104',
          title: '长空之王',
          category: '电影',
          imageUrl: 'https://img.mockdata.com/movie4.jpg',
          year: '2023',
          director: '刘晓世',
          rating: '8.3',
          ratingCount: '6千',
          description: '讲述了一名飞行员不断挑战自我，最终成长为优秀飞行员的故事。',
          genres: ['动作', '剧情']
        }
      ]
      
      // Show data
      const showItems = [
        {
          id: '301',
          title: '周杰伦2023巡回演唱会',
          category: '演唱会',
          imageUrl: 'https://img.mockdata.com/show1.jpg',
          year: '2023',
          rating: '9.5',
          ratingCount: '2万',
          description: '周杰伦2023"嘉年华"世界巡回演唱会，带来全新舞台和歌单。',
          genres: ['演唱会', '音乐']
        },
        {
          id: '302',
          title: '《猫》音乐剧',
          category: '音乐剧',
          imageUrl: 'https://img.mockdata.com/show2.jpg',
          year: '2023',
          rating: '9.0',
          ratingCount: '1万',
          description: '由安德鲁·韦伯创作的经典音乐剧，改编自艾略特的诗集《猫》。',
          genres: ['音乐剧', '戏剧']
        },
        {
          id: '303',
          title: '《狮子王》音乐剧',
          category: '音乐剧',
          imageUrl: 'https://img.mockdata.com/show3.jpg',
          year: '2022',
          rating: '9.2',
          ratingCount: '1.5万',
          description: '迪士尼经典音乐剧《狮子王》中文版，震撼视听体验。',
          genres: ['音乐剧', '动画改编']
        },
        {
          id: '304',
          title: '五月天2023演唱会',
          category: '演唱会',
          imageUrl: 'https://img.mockdata.com/show4.jpg',
          year: '2023',
          rating: '9.3',
          ratingCount: '1.8万',
          description: '五月天"好好好想见到你"巡回演唱会。',
          genres: ['演唱会', '音乐']
        }
      ]
      
      // Filter by tab
      if (tab === 'all') {
        items = [...movieItems, ...showItems]
      } else if (tab === 'movie') {
        items = [...movieItems]
      } else if (tab === 'show') {
        items = [...showItems]
      } else if (tab === 'trending') {
        items = [...movieItems, ...showItems].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      } else if (tab === 'upcoming') {
        items = [
          {
            id: '401',
            title: '封神第二部',
            category: '电影',
            imageUrl: 'https://img.mockdata.com/movie5.jpg',
            year: '2024',
            director: '乌尔善',
            rating: '暂无',
            ratingCount: '未上映',
            description: '封神三部曲第二部，讲述妲己、纣王和姜子牙等人物的故事。',
            genres: ['奇幻', '动作', '神话']
          },
          {
            id: '402',
            title: '周杰伦2024演唱会',
            category: '演唱会',
            imageUrl: 'https://img.mockdata.com/show5.jpg',
            year: '2024',
            rating: '暂无',
            ratingCount: '未开售',
            description: '周杰伦2024年全新巡回演唱会。',
            genres: ['演唱会', '音乐']
          }
        ]
      }
      
      // Apply filters
      if (filterOptions.genres.length > 0) {
        items = items.filter(item => {
          if (!item.genres) return false
          return filterOptions.genres.some(genre => item.genres.includes(genre))
        })
      }
      
      if (filterOptions.year) {
        items = items.filter(item => item.year === filterOptions.year)
      }
      
      if (filterOptions.minRating) {
        items = items.filter(item => {
          const rating = parseFloat(item.rating)
          return !isNaN(rating) && rating >= parseFloat(filterOptions.minRating)
        })
      }
      
      // Apply sorting
      if (sortBy === 'rating') {
        items.sort((a, b) => {
          const ratingA = parseFloat(a.rating) || 0
          const ratingB = parseFloat(b.rating) || 0
          return ratingB - ratingA
        })
      } else if (sortBy === 'newest') {
        items.sort((a, b) => {
          const yearA = parseInt(a.year) || 0
          const yearB = parseInt(b.year) || 0
          return yearB - yearA
        })
      }
      
      // Pagination (mock)
      const startIndex = 0
      const endIndex = this.data.pageSize
      const pageItems = items.slice(startIndex, endIndex)
      
      this.setData({
        items: pageItems,
        isLoading: false,
        noMore: items.length <= this.data.pageSize
      })
      
      if (callback) callback()
    }, 1000)
  },

  loadMoreData() {
    if (this.data.noMore) return
    
    const nextPage = this.data.page + 1
    
    this.setData({
      page: nextPage,
      isLoading: true
    })
    
    // This would be a real API call in a production app
    setTimeout(() => {
      // Mock loading more data - just duplicate existing items with new IDs
      const moreItems = this.data.items.map(item => ({
        ...item,
        id: item.id + '_p' + nextPage,
        title: item.title + ' ' + nextPage
      }))
      
      this.setData({
        items: [...this.data.items, ...moreItems],
        isLoading: false,
        noMore: nextPage >= 3 // Limit to 3 pages for demo
      })
    }, 1000)
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  }
})