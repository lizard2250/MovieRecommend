// api.js - 简单的API客户端封装

// 基础URL
const BASE_URL = 'https://api.recommendation-app.com/v1';

// 请求函数封装
function request(url, method = 'GET', data = {}, needToken = false) {
  return new Promise((resolve, reject) => {
    // 设置请求头
    const header = {
      'Content-Type': 'application/json'
    };
    
    // 如果需要令牌，从存储中获取并添加到请求头
    if (needToken) {
      const token = wx.getStorageSync('token');
      if (!token) {
        // 没有令牌，可能需要登录
        reject({ code: 'UNAUTHORIZED', message: '请先登录' });
        return;
      }
      header.Authorization = `Bearer ${token}`;
    }
    
    // 发起请求
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header,
      success: (res) => {
        // 检查请求是否成功
        if (res.statusCode === 200) {
          if (res.data.success) {
            resolve(res.data.data);
          } else {
            // API返回错误
            reject(res.data.error);
          }
        } else if (res.statusCode === 401) {
          // 授权问题，可能是令牌过期
          wx.removeStorageSync('token');
          reject({ code: 'TOKEN_EXPIRED', message: '登录已过期，请重新登录' });
        } else {
          // 其他HTTP错误
          reject({ code: 'HTTP_ERROR', message: `请求失败: ${res.statusCode}` });
        }
      },
      fail: (err) => {
        // 网络或其他错误
        reject({ code: 'NETWORK_ERROR', message: '网络连接失败' });
      }
    });
  });
}

// 用户相关API
const userAPI = {
  // 登录
  login(code, userInfo) {
    return request('/auth/login', 'POST', { code, userInfo });
  },
  
  // 刷新令牌
  refreshToken() {
    return request('/auth/refresh-token', 'POST', {}, true);
  },
  
  // 获取用户个人信息
  getProfile() {
    return request('/user/profile', 'GET', {}, true);
  },
  
  // 获取用户收藏
  getCollections(page = 1, pageSize = 20) {
    return request(`/user/collections?page=${page}&pageSize=${pageSize}`, 'GET', {}, true);
  },
  
  // 获取用户评分记录
  getRatings(page = 1, pageSize = 20) {
    return request(`/user/ratings?page=${page}&pageSize=${pageSize}`, 'GET', {}, true);
  },
  
  // 获取浏览历史
  getHistory(page = 1, pageSize = 20) {
    return request(`/user/history?page=${page}&pageSize=${pageSize}`, 'GET', {}, true);
  }
};

// 内容相关API
const contentAPI = {
  // 获取首页内容
  getHomeContent() {
    return request('/home');
  },
  
  // 获取AI推荐
  getRecommendations() {
    return request('/recommendations', 'GET', {}, true);
  },
  
  // 获取内容详情
  getDetail(id) {
    return request(`/detail/${id}`);
  },
  
  // 获取评论
  getComments(id, page = 1, pageSize = 10) {
    return request(`/comments/${id}?page=${page}&pageSize=${pageSize}`);
  },
  
  // 提交评分和评论
  submitRating(itemId, rating, comment = '') {
    return request('/rating', 'POST', { itemId, rating, comment }, true);
  },
  
  // 收藏/取消收藏
  toggleCollection(itemId, action) {
    return request('/collection', 'POST', { itemId, action }, true);
  }
};

// 搜索相关API
const searchAPI = {
  // 搜索内容
  search(keyword, type = 'all', page = 1, pageSize = 20) {
    return request(`/search?keyword=${encodeURIComponent(keyword)}&type=${type}&page=${page}&pageSize=${pageSize}`);
  },
  
  // 获取热门搜索
  getTrending() {
    return request('/search/trending');
  },
  
  // 获取搜索建议
  getSuggestions(keyword) {
    return request(`/search/suggestions?keyword=${encodeURIComponent(keyword)}`);
  }
};

// 分类相关API
const categoryAPI = {
  // 获取分类列表
  getCategories() {
    return request('/categories');
  },
  
  // 获取分类内容
  getCategoryItems(categoryId, options = {}) {
    const { sort = 'default', year = '', genres = '', minRating = '', page = 1, pageSize = 20 } = options;
    let url = `/category/${categoryId}?sort=${sort}&page=${page}&pageSize=${pageSize}`;
    
    if (year) url += `&year=${year}`;
    if (genres) url += `&genres=${encodeURIComponent(genres)}`;
    if (minRating) url += `&minRating=${minRating}`;
    
    return request(url);
  }
};

// 导出各个API模块
module.exports = {
  userAPI,
  contentAPI,
  searchAPI,
  categoryAPI
}; 