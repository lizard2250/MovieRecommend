# API 文档说明

## 概述

本目录包含智能推荐小程序的API文档和客户端代码。

## 文件说明

- **api_documentation.md**: 详细的API接口文档，包含所有后端接口的详细说明
- **api.js**: 封装的API客户端代码，用于在小程序中调用后端API

## 使用方法

1. 将 `api.js` 文件放入项目的 `utils` 目录
2. 在需要使用的页面或组件中引入：

```javascript
const { userAPI, contentAPI, searchAPI, categoryAPI } = require('../../utils/api.js');
```

3. 调用相应的API方法，例如：

```javascript
// 获取首页内容
contentAPI.getHomeContent()
  .then(data => {
    // 处理返回的数据
    this.setData({
      banners: data.banners,
      trending: data.trending,
      movies: data.movies,
      shows: data.shows
    });
  })
  .catch(error => {
    // 处理错误
    console.error('获取首页内容失败:', error);
  });
```

## API文档使用指南

API文档采用RESTful风格设计，主要包含以下几个部分：

1. **认证API**: 用户登录、令牌刷新等
2. **内容API**: 首页内容、详情、评论、评分等
3. **搜索API**: 内容搜索、热门搜索、搜索建议等
4. **分类API**: 分类列表、分类内容等
5. **用户API**: 用户信息、收藏、评分记录、浏览历史等

## 后端开发注意事项

如果您要开发配套的后端API，请确保：

1. 实现 `api_documentation.md` 中描述的所有接口
2. 遵循文档中的请求和响应格式
3. 实现JWT认证机制
4. 处理API文档中描述的错误情况

## 更新记录

- 2023-10-15: 初始版本
- 2023-10-20: 添加用户个性化推荐API
- 2023-10-25: 增加情感分析相关接口 