// pages/category/category.js
const app = getApp()
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
      minRating: ''
    },
    type: 'movie', // movie or show
    movies: [],
    shows: [],
    loading: false,
    hasMore: true,
    showGenreFilter: false,
    showSortFilter: false,
    selectedGenre: '',
    selectedSort: 0,
    genres: [
      '动作',
      '喜剧',
      '爱情',
      '科幻',
      '恐怖',
      '动画',
      '悬疑',
      '惊悚',
      '犯罪',
      '冒险',
      '奇幻',
      '家庭',
      '战争',
      '传记',
      '历史',
      '音乐',
      '歌舞',
      '纪录片'
    ],
    sortOptions: [
      { text: '默认排序', value: 'default' },
      { text: '评分最高', value: 'rating' },
      { text: '最多评价', value: 'votes' }
    ],
    filteredMovies: []
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
      hasMore: true
    }, () => {
      this.loadData(true)
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (!this.data.loading && this.data.hasMore) {
      this.loadData()
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

  toggleFilter(e) {
    const type = e.currentTarget.dataset.type
    
    // 如果当前面板已经打开，则关闭它
    if (
      (type === 'genre' && this.data.showGenreFilter) ||
      (type === 'sort' && this.data.showSortFilter)
    ) {
      this.closeAllFilters()
      return
    }
    
    // 关闭其他筛选面板，只打开当前点击的面板
    this.setData({
      showGenreFilter: type === 'genre',
      showSortFilter: type === 'sort'
    })
  },

  closeAllFilters() {
    this.setData({
      showGenreFilter: false,
      showSortFilter: false
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

  setRatingFilter(e) {
    const rating = e.currentTarget.dataset.rating
    
    this.setData({
      'filterOptions.minRating': this.data.filterOptions.minRating === rating ? '' : rating
    })
  },

  resetFilters() {
    this.setData({
      selectedGenre: '',
      selectedSort: 0,
      page: 1,
      hasMore: true
    }, () => {
      this.applyFilters()
    })
  },

  applyFilters() {
    console.log('筛选条件：', {
      genre: this.data.selectedGenre,
      sort: this.data.sortOptions[this.data.selectedSort].value
    })

    this.setData({
      loading: true
    })

    // 使用当前加载的movies数据进行筛选，而不是从本地存储获取
    let filtered = [...this.data.movies]
    console.log('当前电影数量：', filtered.length)

    // 按类型筛选
    if (this.data.selectedGenre) {
      filtered = filtered.filter(movie => 
        movie.genre && movie.genre.includes(this.data.selectedGenre)
      )
    }

    // 按排序方式排序
    const sortType = this.data.sortOptions[this.data.selectedSort].value
    if (sortType === 'rating') {
      filtered.sort((a, b) => {
        const ratingA = a.rating ? parseFloat(a.rating) : 0
        const ratingB = b.rating ? parseFloat(b.rating) : 0
        return ratingB - ratingA
      })
    } else if (sortType === 'votes') {
      filtered.sort((a, b) => {
        const votesA = a.vote_num ? parseInt(a.vote_num) : 0
        const votesB = b.vote_num ? parseInt(b.vote_num) : 0
        return votesB - votesA
      })
    }

    console.log('筛选后电影数量：', filtered.length)

    this.setData({
      filteredMovies: filtered,
      loading: false
    })
  },

  resetAndReload() {
    console.log('重置所有筛选并重新加载数据');
    this.setData({
      page: 1,
      movies: [],
      filteredMovies: [],
      hasMore: true,
      selectedGenre: '',
      selectedSort: 0
    }, () => {
      this.loadData(true);
    });
  },

  async loadData(isRefresh = false) {
    if (this.data.loading || (!isRefresh && !this.data.hasMore)) return;

    this.setData({ loading: true });
    wx.showLoading({ title: '加载中' });

    try {
      console.log('开始加载电影数据, 页码:', this.data.page);
      
      // 获取电影数据
      const movies = await api.getNowPlaying(this.data.page);
      
      if (!movies || !movies.length) {
        console.log('没有获取到电影数据');
        this.setData({ 
          hasMore: false,
          loading: false
        });
        wx.hideLoading();
        return;
      }

      console.log(`获取到 ${movies.length} 部电影`);
      
      // 处理电影数据
      const items = movies.map(movie => ({
        movie_id: movie.movie_id,
        title: movie.title,
        imageUrl: api.getMoviePoster(movie.movie_id),
        rating: movie.rating || '暂无评分',
        vote_num: movie.vote_num || 0,
        release_date: movie.release_date || '',
        genre: movie.genre || '',
        director: movie.director || '',
        actors: movie.actors || ''
      }));

      // 更新数据 - 同时更新movies和filteredMovies
      const newMovies = isRefresh ? items : [...this.data.movies, ...items];
      
      this.setData({
        movies: newMovies,
        filteredMovies: isRefresh ? items : [...this.data.filteredMovies, ...items],
        page: this.data.page + 1,
        hasMore: items.length === this.data.pageSize || items.length > 0,
        loading: false
      });
      
      // 如果有筛选条件，应用筛选
      if (this.data.selectedGenre || this.data.selectedSort > 0) {
        this.applyFilters();
      }

    } catch (error) {
      console.error('获取数据失败:', error);
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      });
      this.setData({ loading: false });
    } finally {
      wx.hideLoading();
    }
  },

  switchType(e) {
    const type = e.currentTarget.dataset.type;
    if (type === this.data.type) return;

    this.setData({
      type,
      movies: [],
      shows: [],
      page: 1,
      hasMore: true
    });
    this.loadData();
  },

  switchViewMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      viewMode: mode
    });
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  selectGenre(e) {
    const genre = e.currentTarget.dataset.genre
    console.log('选择类型：', genre)
    
    if (this.data.selectedGenre === genre) {
      return
    }
    
    this.setData({
      selectedGenre: genre,
      page: 1,
      hasMore: true
    }, () => {
      this.applyFilters()
    })
  },

  selectSort(e) {
    const sortIndex = parseInt(e.currentTarget.dataset.sort)
    console.log('选择排序方式：', this.data.sortOptions[sortIndex].text)
    
    if (this.data.selectedSort === sortIndex) {
      return
    }
    
    this.setData({
      selectedSort: sortIndex,
      page: 1,
      hasMore: true
    }, () => {
      this.applyFilters()
    })
  }
})