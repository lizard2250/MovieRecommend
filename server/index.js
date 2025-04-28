const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 模拟数据
const mockMovies = [
  {
    id: '1',
    title: '流浪地球2',
    images: {
      large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886187418.jpg',
      medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886187418.jpg'
    },
    rating: {
      average: 8.3
    },
    collect_count: 1000000,
    year: '2023',
    directors: [{ name: '郭帆' }],
    genres: ['科幻', '冒险']
  },
  {
    id: '2',
    title: '满江红',
    images: {
      large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886187418.jpg',
      medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886187418.jpg'
    },
    rating: {
      average: 7.2
    },
    collect_count: 800000,
    year: '2023',
    directors: [{ name: '张艺谋' }],
    genres: ['剧情', '悬疑']
  },
  {
    id: '3',
    title: '无名',
    images: {
      large: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886187418.jpg',
      medium: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2886187418.jpg'
    },
    rating: {
      average: 6.8
    },
    collect_count: 500000,
    year: '2023',
    directors: [{ name: '程耳' }],
    genres: ['剧情', '历史']
  }
];

// 代理路由
app.get('/api/in_theaters', (req, res) => {
  res.json({
    subjects: mockMovies
  });
});

app.get('/api/coming_soon', (req, res) => {
  res.json({
    subjects: mockMovies
  });
});

app.get('/api/subject/:id', (req, res) => {
  const movie = mockMovies.find(m => m.id === req.params.id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
});

app.get('/api/search', (req, res) => {
  const keyword = req.query.q.toLowerCase();
  const results = mockMovies.filter(movie => 
    movie.title.toLowerCase().includes(keyword)
  );
  res.json({
    subjects: results
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 