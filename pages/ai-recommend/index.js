const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    inputValue: '',
    candidateMovies: [],
    currentMovieIndex: 0,
    recommendations: [],
    loading: false,
    feedback: {},
    step: 'input', // 'input', 'selection', 'result'
    uid: '123456', // 默认用户ID
    showGenerateButton: false // 控制生成按钮的显示
  },

  onLoad() {
    // 页面加载时的初始化逻辑
  },

  // 输入框内容变化处理
  onInputChange(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 提交用户输入，获取候选电影
  async onSubmitInput() {
    if (!this.data.inputValue.trim()) {
      wx.showToast({
        title: '请输入您想看的电影类型',
        icon: 'none'
      })
      return
    }

    this.setData({ loading: true })

    try {
      // 这里应该调用后端API获取候选电影
      // 由于我们没有专门的API，这里先使用getNowPlaying获取电影，然后随机选择3部作为候选
      const allMovies = await api.getNowPlaying(1)
      
      if (!allMovies || allMovies.length === 0) {
        throw new Error('没有获取到电影数据')
      }
      
      // 随机选择3部电影作为候选
      const shuffled = [...allMovies].sort(() => 0.5 - Math.random())
      const candidates = shuffled.slice(0, 3).map(movie => ({
        id: movie.movie_id,
        title: movie.title,
        imageUrl: api.getMoviePoster(movie.movie_id),
        rating: movie.rating || '暂无评分',
        genre: movie.genre || '未知类型'
      }))

      this.setData({
        candidateMovies: candidates,
        currentMovieIndex: 0,
        step: 'selection',
        feedback: {},
        showGenerateButton: false
      })
    } catch (error) {
      console.error('获取候选电影失败:', error)
      wx.showToast({
        title: '获取候选电影失败',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  // 记录用户对电影的反馈
  onMovieFeedback(e) {
    const { movieId, feedback } = e.currentTarget.dataset
    
    // 更新反馈数据
    this.setData({
      [`feedback.${movieId}`]: parseInt(feedback)
    })
    
    // 获取当前电影索引和总数
    const { currentMovieIndex, candidateMovies } = this.data
    
    // 显示按钮颜色变化的反馈
    wx.showToast({
      title: feedback == 1 ? '已选择喜欢' : (feedback == 0 ? '已选择中立' : '已选择不喜欢'),
      icon: 'none',
      duration: 500
    })
    
    // 延迟一下再切换到下一部电影，让用户看到按钮变色效果
    setTimeout(() => {
      // 如果不是最后一部电影，前进到下一部
      if (currentMovieIndex < candidateMovies.length - 1) {
        this.setData({
          currentMovieIndex: currentMovieIndex + 1
        })
      } else {
        // 如果是最后一部电影，显示生成推荐按钮
        this.setData({
          showGenerateButton: true
        })
        
        wx.showToast({
          title: '已完成所有评价',
          icon: 'success'
        })
      }
    }, 300)
  },

  // 生成AI推荐
  async onGenerateRecommendations() {
    // 检查是否所有电影都有了反馈
    if (Object.keys(this.data.feedback).length < this.data.candidateMovies.length) {
      wx.showToast({
        title: '请对所有电影进行评价',
        icon: 'none'
      })
      return
    }

    this.setData({ loading: true })

    try {
      // 调用AI推荐API
      const result = await api.getAiRecommendations(this.data.uid, {
        feedback: this.data.feedback,
        query: this.data.inputValue
      })

      this.setData({
        recommendations: result.recommend_movies,
        step: 'result'
      })
    } catch (error) {
      console.error('获取AI推荐失败:', error)
      // 如果API调用失败，使用模拟数据
      const mockResult = await this.mockAiRecommendation()
      this.setData({
        recommendations: mockResult.recommend_movies,
        step: 'result'
      })
      wx.showToast({
        title: '使用模拟推荐数据',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  // 模拟AI推荐API调用（作为备用）
  mockAiRecommendation() {
    return new Promise(async (resolve) => {
      // 获取一些电影作为推荐结果
      try {
        const allMovies = await api.getNowPlaying(1)
        
        // 根据用户反馈，筛选出一些电影
        const likedMovies = Object.entries(this.data.feedback)
          .filter(([_, value]) => value === 1)
          .map(([key, _]) => key)
        
        // 获取用户喜欢的电影详情
        const likedMovieDetails = []
        for (const movieId of likedMovies) {
          try {
            const movie = await api.getMovieDetail(movieId)
            if (movie) {
              likedMovieDetails.push(movie)
            }
          } catch (err) {
            console.error(`获取电影 ${movieId} 详情失败:`, err)
          }
        }
        
        // 提取用户喜欢的类型
        const likedTypes = new Set()
        likedMovieDetails.forEach(movie => {
          if (movie.genre) {
            movie.genre.split('/').forEach(type => {
              likedTypes.add(type.trim())
            })
          }
        })
        
        // 根据类型筛选推荐电影
        let recommendMovies = allMovies.filter(movie => {
          if (!movie.genre) return false
          
          const movieTypes = movie.genre.split('/').map(type => type.trim())
          return movieTypes.some(type => likedTypes.has(type))
        })
        
        // 如果没有匹配的类型，就随机推荐
        if (recommendMovies.length < 3) {
          recommendMovies = [...allMovies].sort(() => 0.5 - Math.random())
        }
        
        // 选取前5部作为推荐
        const recommendations = recommendMovies.slice(0, 5).map(movie => ({
          movie_id: movie.movie_id,
          movie_name: movie.title,
          ai_rating: (Math.random() * 2 + 8).toFixed(1), // 8.0-10.0之间的随机分数
          reason_good: `这部电影的${movie.genre}风格非常符合您的喜好`,
          reason_bad: '可能节奏稍慢，需要耐心观看',
          recommendation_score: (Math.random() * 3 + 7).toFixed(1), // 7.0-10.0之间的推荐分数
          douban_rating: movie.rating || '暂无评分'
        }))
        
        resolve({
          uid: this.data.uid,
          like_movie: likedMovieDetails.map(m => m.title),
          like_type: Array.from(likedTypes),
          recommend_movies: recommendations
        })
      } catch (error) {
        console.error('模拟AI推荐失败:', error)
        // 如果失败，返回一些默认推荐
        resolve({
          uid: this.data.uid,
          like_movie: [],
          like_type: [],
          recommend_movies: [
            {
              movie_id: '1',
              movie_name: '流浪地球2',
              ai_rating: '9.2',
              reason_good: '这部科幻电影非常符合您的喜好',
              reason_bad: '部分科学设定可能不够严谨',
              recommendation_score: '9.5',
              douban_rating: '8.3'
            },
            {
              movie_id: '2',
              movie_name: '满江红',
              ai_rating: '8.7',
              reason_good: '这部悬疑电影情节紧凑，符合您的观影偏好',
              reason_bad: '历史背景需要一定了解',
              recommendation_score: '8.8',
              douban_rating: '7.2'
            }
          ]
        })
      }
    })
  },

  // 处理图片加载错误
  onImageError(e) {
    const id = e.currentTarget.dataset.id
    const index = this.data.candidateMovies.findIndex(item => item.id === id)
    if (index !== -1) {
      this.setData({
        [`candidateMovies[${index}].imageUrl`]: '/images/default-movie.png'
      })
    }
  },

  // 重新开始
  onRestart() {
    this.setData({
      inputValue: '',
      candidateMovies: [],
      currentMovieIndex: 0,
      recommendations: [],
      feedback: {},
      step: 'input',
      showGenerateButton: false
    })
  },

  // 导航到电影详情页
  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  }
}) 