// utils/api.js
// 开发环境使用本地服务器，生产环境使用正式域名
const API_BASE_URL = 'http://47.120.72.255'
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
const getNowPlaying = (page = 1) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/mobile/movie/nowplaying/beijing`,
      method: 'GET',
      success: async (res) => {
        try {
          // 添加调试信息
          console.log('服务器返回的原始数据:', res);
          console.log('状态码:', res.statusCode);
          
          // 检查状态码
          if (res.statusCode !== 200) {
            console.error('服务器响应错误，状态码:', res.statusCode);
            reject(new Error(`服务器响应错误: ${res.statusCode}`));
            return;
          }

          // 验证响应数据
          if (!res.data && res.data !== 0) {
            console.error('获取电影列表失败：服务器返回空数据');
            reject(new Error('获取电影列表失败：服务器返回空数据'));
            return;
          }

          // 尝试解析数据
          let movieIds;
          if (typeof res.data === 'string') {
            try {
              movieIds = JSON.parse(res.data);
            } catch (e) {
              console.error('解析JSON数据失败:', e);
              movieIds = [];
            }
          } else {
            movieIds = res.data;
          }

          // 确保 movieIds 是数组
          movieIds = Array.isArray(movieIds) ? movieIds : [movieIds];
          
          if (movieIds.length === 0) {
            console.log('当前页面没有正在热映的电影');
            resolve([]);
            return;
          }

          console.log('处理后的电影ID列表:', movieIds);

          // 获取每个电影的详细信息
          const moviePromises = movieIds.map(item => 
            new Promise((resolve, reject) => {
              const movieId = item.movie_id || item;
              if (!movieId) {
                console.error('无效的电影ID:', item);
                resolve(null);
                return;
              }

              wx.request({
                url: `${API_BASE_URL}/mobile/movie/info/${movieId}`,
                method: 'GET',
                success: (detailRes) => {
                  console.log(`电影 ${movieId} 详情:`, detailRes);
                  if (detailRes.data && detailRes.data.length > 0) {
                    resolve(detailRes.data[0]);
                  } else if (detailRes.data) {
                    resolve(detailRes.data);
                  } else {
                    console.error(`电影 ${movieId} 详情获取失败`);
                    resolve(null);
                  }
                },
                fail: (error) => {
                  console.error(`获取电影 ${movieId} 详情失败:`, error);
                  resolve(null);
                }
              });
            })
          );

          const movies = await Promise.all(moviePromises);
          // 过滤掉无效的电影数据
          const validMovies = movies.filter(movie => movie !== null);
          console.log('最终处理的电影数据:', validMovies);
          resolve(validMovies);
        } catch (error) {
          console.error('处理电影数据时出错:', error);
          reject(error);
        }
      },
      fail: (error) => {
        console.error('请求电影列表失败:', error);
        reject(error);
      }
    });
  });
}

// 获取电影详情
const getMovieDetail = (id) => {
  return new Promise((resolve, reject) => {
    console.log(`正在获取电影ID: ${id} 的详情...`);
    
    wx.request({
      url: `${API_BASE_URL}/mobile/movie/info/${id}`,
      method: 'GET',
      success: (res) => {
        console.log(`电影详情API返回:`, res);
        
        if (res.statusCode !== 200) {
          console.error(`服务器返回错误状态码: ${res.statusCode}`);
          reject(new Error(`服务器响应错误: ${res.statusCode}`));
          return;
        }
        
        if (res.data && res.data.length > 0) {
          console.log(`成功获取电影详情:`, res.data[0]);
          resolve(res.data[0]);
        } else if (res.data) {
          // 如果返回的不是数组，但有数据
          console.log(`获取到电影详情(非数组格式):`, res.data);
          resolve(res.data);
        } else {
          console.error(`未找到ID为 ${id} 的电影`);
          reject(new Error('Movie not found'));
        }
      },
      fail: (err) => {
        console.error(`请求电影详情失败:`, err);
        reject(err);
      }
    });
  });
}

// 搜索电影
const searchMovies = (keyword) => {
  console.log(`开始搜索电影，关键词: "${keyword}"`);
  return new Promise(async (resolve, reject) => {
    try {
      // 先获取所有正在热映电影
      const allMovies = await getNowPlaying(1);
      
      if (!allMovies || allMovies.length === 0) {
        console.log('没有获取到电影数据进行搜索');
        resolve([]);
        return;
      }
      
      console.log(`获取到 ${allMovies.length} 部电影数据用于搜索`);
      
      // 过滤符合搜索条件的电影
      const normalizedKeyword = keyword.toLowerCase();
      const filteredMovies = allMovies.filter(movie => {
        // 尝试匹配多个字段
        const titleMatch = movie.title && movie.title.toLowerCase().includes(normalizedKeyword);
        const originalTitleMatch = movie.original_title && movie.original_title.toLowerCase().includes(normalizedKeyword);
        const directorMatch = movie.director && movie.director.toLowerCase().includes(normalizedKeyword);
        const actorsMatch = movie.actors && movie.actors.toLowerCase().includes(normalizedKeyword);
        const genreMatch = movie.genre && movie.genre.toLowerCase().includes(normalizedKeyword);
        
        return titleMatch || originalTitleMatch || directorMatch || actorsMatch || genreMatch;
      });
      
      console.log(`搜索到 ${filteredMovies.length} 部匹配的电影`);
      resolve(filteredMovies);
    } catch (error) {
      console.error('搜索电影时出错:', error);
      reject(error);
    }
  });
}

// 获取即将上映的电影
const getComingSoon = () => {
  // 由于API没有提供即将上映功能，这里暂时返回正在热映的电影
  return getNowPlaying(1);
}

// 获取电影海报
const getMoviePoster = (movieId) => {
  return `${API_BASE_URL}/mobile/movie/photo/${movieId}`;
}

// 获取AI推荐电影
const getAiRecommendations = (uid, preferences) => {
  console.log(`获取用户 ${uid} 的AI推荐，偏好:`, preferences);
  return new Promise((resolve, reject) => {
    // 实际项目中应该调用真实的AI推荐API
    // 这里我们使用 /mobile/movie/recommend/{uid} 接口
    wx.request({
      url: `${API_BASE_URL}/mobile/movie/recommend/${uid}`,
      method: 'GET',
      success: (res) => {
        console.log('AI推荐API返回:', res);
        
        if (res.statusCode !== 200) {
          console.error(`服务器返回错误状态码: ${res.statusCode}`);
          reject(new Error(`服务器响应错误: ${res.statusCode}`));
          return;
        }
        
        if (res.data) {
          console.log('成功获取AI推荐:', res.data);
          resolve(res.data);
        } else {
          console.error('AI推荐API返回空数据');
          reject(new Error('AI推荐API返回空数据'));
        }
      },
      fail: (err) => {
        console.error('请求AI推荐失败:', err);
        reject(err);
      }
    });
  });
}

module.exports = {
  getNowPlaying,
  getMovieDetail,
  searchMovies,
  getComingSoon,
  getMoviePoster,
  getAiRecommendations
} 