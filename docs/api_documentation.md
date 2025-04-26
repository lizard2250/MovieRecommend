# 推荐小程序 API 文档

## 基础信息

- **基础URL**: `https://api.recommendation-app.com/v1`
- **认证方式**: JWT Token（通过 Authorization Header）
- **响应格式**: JSON
- **版本**: v1

## 认证API

### 登录

- **URL**: `/auth/login`
- **Method**: POST
- **描述**: 用户登录并获取访问令牌
- **请求体**:
  ```json
  {
    "code": "wx.login获取的code",
    "userInfo": {
      "nickName": "用户昵称",
      "avatarUrl": "头像URL",
      "gender": 1
    }
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "userId": "u123456",
      "expiresIn": 7200
    },
    "message": "登录成功"
  }
  ```

### 刷新令牌

- **URL**: `/auth/refresh-token`
- **Method**: POST
- **描述**: 刷新访问令牌
- **Headers**: Authorization: Bearer {token}
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 7200
    },
    "message": "令牌已刷新"
  }
  ```

## 内容API

### 获取首页内容

- **URL**: `/home`
- **Method**: GET
- **描述**: 获取首页的轮播图和各分类推荐内容
- **参数**: 无
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "banners": [
        {
          "id": 1,
          "imageUrl": "https://example.com/image1.jpg",
          "linkId": 101,
          "linkType": "movie"
        }
      ],
      "trending": [
        {
          "id": 101,
          "title": "流浪地球2",
          "imageUrl": "https://example.com/movie1.jpg",
          "rating": "9.1",
          "ratingCount": 12000,
          "category": "movie"
        }
      ],
      "movies": [
        {
          "id": 201,
          "title": "孤注一掷",
          "imageUrl": "https://example.com/movie5.jpg",
          "rating": "8.0",
          "ratingCount": 7000,
          "category": "movie"
        }
      ],
      "shows": [
        {
          "id": 301,
          "title": "周杰伦2023巡回演唱会",
          "imageUrl": "https://example.com/show1.jpg",
          "rating": "9.5",
          "ratingCount": 20000,
          "category": "show"
        }
      ]
    },
    "message": "获取成功"
  }
  ```

### 获取AI推荐

- **URL**: `/recommendations`
- **Method**: GET
- **描述**: 获取基于用户历史的AI推荐内容
- **Headers**: Authorization: Bearer {token}
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "recommendations": [
        {
          "id": 401,
          "title": "封神第一部",
          "imageUrl": "https://example.com/movie9.jpg",
          "rating": "8.4",
          "ratingCount": 9000,
          "category": "movie",
          "reason": "根据您喜欢的科幻和动作电影推荐"
        }
      ]
    },
    "message": "获取成功"
  }
  ```

### 获取详情信息

- **URL**: `/detail/{id}`
- **Method**: GET
- **描述**: 获取电影或演出的详细信息
- **参数**:
  - `id`: 内容ID
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 101,
      "title": "流浪地球2",
      "category": "movie",
      "imageUrl": "https://example.com/detail101.jpg",
      "rating": "9.1",
      "ratingCount": 12000,
      "year": "2023",
      "description": "讲述了人类为了应对太阳即将毁灭的危机，组织起宏大的太空计划，试图带着地球一起逃离太阳系的故事。",
      "director": "郭帆",
      "actors": "吴京, 刘德华, 李雪健, 宁理, 王智",
      "type": "科幻/动作/冒险",
      "language": "中文",
      "duration": "173分钟",
      "sentimentAnalysis": {
        "positive": 75,
        "neutral": 20,
        "negative": 5
      },
      "relatedItems": [
        {
          "id": 102,
          "title": "流浪地球",
          "imageUrl": "https://example.com/related1.jpg",
          "rating": "8.5",
          "ratingCount": 9000
        }
      ]
    },
    "message": "获取成功"
  }
  ```

### 获取评论

- **URL**: `/comments/{id}`
- **Method**: GET
- **描述**: 获取电影或演出的评论
- **参数**:
  - `id`: 内容ID
  - `page`: 页码，默认1
  - `pageSize`: 每页条数，默认10
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 135,
      "page": 1,
      "pageSize": 10,
      "comments": [
        {
          "id": 1,
          "userId": "u123456",
          "username": "用户A",
          "avatar": "https://example.com/avatar1.jpg",
          "rating": 4.5,
          "content": "非常精彩的一部电影，特效很棒，演员表演到位，推荐观看！",
          "time": "2023-08-10",
          "likes": 25
        }
      ]
    },
    "message": "获取成功"
  }
  ```

### 提交评分和评论

- **URL**: `/rating`
- **Method**: POST
- **描述**: 提交用户对内容的评分和评论
- **Headers**: Authorization: Bearer {token}
- **请求体**:
  ```json
  {
    "itemId": 101,
    "rating": 4.5,
    "comment": "非常精彩的一部电影，特效很棒，演员表演到位，推荐观看！"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 12345,
      "rating": 4.5,
      "timestamp": "2023-10-15T08:30:45Z"
    },
    "message": "评分成功"
  }
  ```

### 收藏/取消收藏

- **URL**: `/collection`
- **Method**: POST
- **描述**: 收藏或取消收藏内容
- **Headers**: Authorization: Bearer {token}
- **请求体**:
  ```json
  {
    "itemId": 101,
    "action": "add" // 或 "remove"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "isCollected": true,
      "timestamp": "2023-10-15T08:32:15Z"
    },
    "message": "收藏成功"
  }
  ```

## 搜索API

### 搜索内容

- **URL**: `/search`
- **Method**: GET
- **描述**: 搜索电影、演出或演员
- **参数**:
  - `keyword`: 搜索关键词
  - `type`: 搜索类型，可选值：all, movie, show
  - `page`: 页码，默认1
  - `pageSize`: 每页条数，默认20
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 35,
      "page": 1,
      "pageSize": 20,
      "results": [
        {
          "id": 101,
          "title": "流浪地球2",
          "category": "movie",
          "imageUrl": "https://example.com/movie1.jpg",
          "year": "2023",
          "director": "郭帆",
          "rating": "9.1",
          "ratingCount": 12000,
          "description": "讲述了人类为了应对太阳即将毁灭的危机，组织起宏大的太空计划，试图带着地球一起逃离太阳系的故事。"
        }
      ]
    },
    "message": "搜索成功"
  }
  ```

### 获取热门搜索

- **URL**: `/search/trending`
- **Method**: GET
- **描述**: 获取热门搜索关键词
- **参数**: 无
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "keywords": [
        "流浪地球2", "满江红", "周杰伦", "音乐剧", "独行月球"
      ]
    },
    "message": "获取成功"
  }
  ```

### 获取搜索建议

- **URL**: `/search/suggestions`
- **Method**: GET
- **描述**: 根据输入内容获取搜索建议
- **参数**:
  - `keyword`: 输入关键词
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "suggestions": [
        "流浪地球2", "流浪地球", "流浪星球"
      ]
    },
    "message": "获取成功"
  }
  ```

## 分类API

### 获取分类列表

- **URL**: `/categories`
- **Method**: GET
- **描述**: 获取所有分类
- **参数**: 无
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "categories": [
        {
          "id": "movie",
          "name": "电影",
          "subCategories": [
            {
              "id": "action",
              "name": "动作"
            },
            {
              "id": "sci-fi",
              "name": "科幻"
            }
          ]
        },
        {
          "id": "show",
          "name": "演出",
          "subCategories": [
            {
              "id": "concert",
              "name": "演唱会"
            },
            {
              "id": "musical",
              "name": "音乐剧"
            }
          ]
        }
      ]
    },
    "message": "获取成功"
  }
  ```

### 获取分类内容

- **URL**: `/category/{categoryId}`
- **Method**: GET
- **描述**: 获取特定分类下的内容
- **参数**:
  - `categoryId`: 分类ID
  - `sort`: 排序方式，可选值：default, rating, newest
  - `year`: 年份筛选
  - `genres`: 类型筛选，多个用逗号分隔
  - `minRating`: 最低评分
  - `page`: 页码，默认1
  - `pageSize`: 每页条数，默认20
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 56,
      "page": 1,
      "pageSize": 20,
      "items": [
        {
          "id": 101,
          "title": "流浪地球2",
          "category": "movie",
          "imageUrl": "https://example.com/movie1.jpg",
          "year": "2023",
          "director": "郭帆",
          "rating": "9.1",
          "ratingCount": 12000,
          "description": "讲述了人类为了应对太阳即将毁灭的危机，组织起宏大的太空计划，试图带着地球一起逃离太阳系的故事。"
        }
      ]
    },
    "message": "获取成功"
  }
  ```

## 用户API

### 获取用户信息

- **URL**: `/user/profile`
- **Method**: GET
- **描述**: 获取用户个人信息
- **Headers**: Authorization: Bearer {token}
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "userId": "u123456",
      "nickname": "影评达人",
      "avatar": "https://example.com/avatar_default.jpg",
      "stats": {
        "ratingCount": 35,
        "collectCount": 28,
        "commentCount": 24
      },
      "preferences": {
        "tags": ["科幻", "动作", "悬疑", "剧情", "音乐剧"]
      }
    },
    "message": "获取成功"
  }
  ```

### 获取用户收藏

- **URL**: `/user/collections`
- **Method**: GET
- **描述**: 获取用户收藏的内容
- **Headers**: Authorization: Bearer {token}
- **参数**:
  - `page`: 页码，默认1
  - `pageSize`: 每页条数，默认20
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 28,
      "page": 1,
      "pageSize": 20,
      "items": [
        {
          "id": 101,
          "title": "流浪地球2",
          "imageUrl": "https://example.com/movie1.jpg",
          "rating": "9.1",
          "ratingCount": 12000,
          "category": "movie",
          "collectTime": "2023-08-05T12:30:45Z"
        }
      ]
    },
    "message": "获取成功"
  }
  ```

### 获取用户评分记录

- **URL**: `/user/ratings`
- **Method**: GET
- **描述**: 获取用户的评分历史
- **Headers**: Authorization: Bearer {token}
- **参数**:
  - `page`: 页码，默认1
  - `pageSize`: 每页条数，默认20
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 35,
      "page": 1,
      "pageSize": 20,
      "items": [
        {
          "id": 101,
          "title": "流浪地球2",
          "imageUrl": "https://example.com/movie1.jpg",
          "category": "movie",
          "userRating": 4.5,
          "comment": "非常精彩的一部电影，特效很棒，演员表演到位，推荐观看！",
          "ratingTime": "2023-08-10T08:45:30Z"
        }
      ]
    },
    "message": "获取成功"
  }
  ```

### 获取浏览历史

- **URL**: `/user/history`
- **Method**: GET
- **描述**: 获取用户的浏览历史
- **Headers**: Authorization: Bearer {token}
- **参数**:
  - `page`: 页码，默认1
  - `pageSize`: 每页条数，默认20
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 45,
      "page": 1,
      "pageSize": 20,
      "items": [
        {
          "id": 101,
          "title": "流浪地球2",
          "imageUrl": "https://example.com/movie1.jpg",
          "rating": "9.1",
          "ratingCount": 12000,
          "category": "movie",
          "viewTime": "2023-10-14T15:20:30Z"
        }
      ]
    },
    "message": "获取成功"
  }
  ```

## 错误处理

### 错误响应格式
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述信息"
  }
}
```

### 常见错误码
- `UNAUTHORIZED`: 未授权访问，需要登录
- `TOKEN_EXPIRED`: 令牌已过期，需要刷新
- `INVALID_PARAMS`: 参数无效
- `RESOURCE_NOT_FOUND`: 请求的资源不存在
- `SERVER_ERROR`: 服务器内部错误

## 数据模型

### 电影/演出

| 字段 | 类型 | 描述 |
|-----|------|-----|
| id | Integer | 唯一标识 |
| title | String | 标题 |
| category | String | 分类(movie/show) |
| imageUrl | String | 封面图URL |
| year | String | 年份 |
| rating | String | 评分 |
| ratingCount | Integer | 评分人数 |
| description | String | 描述 |
| director | String | 导演(电影) |
| actors | String | 演员(电影) |
| type | String | 类型 |
| language | String | 语言 |
| duration | String | 时长 |
| venue | String | 场馆(演出) |
| showDate | String | 演出时间(演出) |

### 用户

| 字段 | 类型 | 描述 |
|-----|------|-----|
| userId | String | 用户ID |
| nickname | String | 昵称 |
| avatar | String | 头像URL |
| openId | String | 微信OpenID(内部) |
| unionId | String | 微信UnionID(内部) |
| createTime | DateTime | 创建时间 |
| lastLoginTime | DateTime | 最后登录时间 |

### 评分/评论

| 字段 | 类型 | 描述 |
|-----|------|-----|
| id | Integer | 唯一标识 |
| userId | String | 用户ID |
| itemId | Integer | 内容ID |
| rating | Float | 评分(1-5) |
| comment | String | 评论内容 |
| time | DateTime | 评论时间 |
| likes | Integer | 点赞数 | 