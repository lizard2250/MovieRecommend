// utils/api.js
// 开发环境使用本地服务器，生产环境使用正式域名
const API_BASE_URL = 'http://localhost:3000/api'  // 开发环境
// const API_BASE_URL = 'https://your-production-domain.com/api'  // 生产环境

// 模拟电影数据
const mockMovies = [
  {
    id: '1',
    title: '流浪地球2',
    imageUrl: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886187418.jpg',
    rating: '8.3',
    ratingCount: '100万人评',
    year: '2023',
    director: '郭帆',
    category: '科幻 / 冒险'
  },
  {
    id: '2',
    title: '满江红',
    imageUrl: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886187418.jpg',
    rating: '7.2',
    ratingCount: '80万人评',
    year: '2023',
    director: '张艺谋',
    category: '剧情 / 悬疑'
  },
  {
    id: '3',
    title: '无名',
    imageUrl: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886187418.jpg',
    rating: '6.8',
    ratingCount: '50万人评',
    year: '2023',
    director: '程耳',
    category: '剧情 / 历史'
  }
];

// 模拟演出数据
const mockShows = [
  {
    id: '1',
    title: '话剧《雷雨》',
    imageUrl: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886187418.jpg',
    rating: '9.2',
    ratingCount: '5万人评',
    year: '2023',
    category: '话剧'
  },
  {
    id: '2',
    title: '音乐会《春之声》',
    imageUrl: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886187418.jpg',
    rating: '8.8',
    ratingCount: '3万人评',
    year: '2023',
    category: '音乐会'
  }
];

// 获取正在热映的电影
const getInTheaters = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/in_theaters`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 获取即将上映的电影
const getComingSoon = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/coming_soon`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 获取电影详情
const getMovieDetail = (id) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/subject/${id}`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 搜索电影
const searchMovies = (keyword) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/search`,
      method: 'GET',
      data: {
        q: keyword
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

module.exports = {
  getInTheaters,
  getComingSoon,
  getMovieDetail,
  searchMovies
} 