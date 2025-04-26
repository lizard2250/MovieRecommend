# 智能推荐小程序

基于AI和数据分析的电影、演出内容智能推荐小程序，提供个性化推荐、评分、评论、搜索等功能。

## 项目概述

该项目是一个基于微信小程序的内容推荐平台，具有以下功能模块：

1. **数据接入模块**：接入豆瓣、大麦等平台数据
2. **AI分析模块**：评论情感分析、用户标签提取、上座率和评分趋势分析
3. **推荐算法模块**：基于协同过滤/内容推荐/混合模型的个性化推荐
4. **小程序前端**：用户界面及交互功能

## 技术栈

- **前端**：微信小程序原生开发
- **后端**：Node.js + Express
- **数据库**：MongoDB
- **AI模型**：TensorFlow、BERT (自然语言处理)
- **推荐算法**：协同过滤、内容推荐、混合模型
- **数据源**：第三方API + 网页爬虫

## 项目结构

```
miniprogram/
│
├── app.js                # 小程序入口
├── app.json              # 小程序全局配置
├── app.wxss              # 小程序全局样式
│
├── pages/                # 页面目录
│   ├── index/            # 首页
│   ├── detail/           # 详情页
│   ├── search/           # 搜索页
│   ├── category/         # 分类页
│   └── user/             # 用户页
│
├── components/           # 组件目录
│   ├── rating/           # 评分组件
│   └── comment/          # 评论组件
│
├── utils/                # 工具函数
│   ├── mock-chart.js     # 图表模拟工具
│   └── util.js           # 通用工具函数
│
├── images/               # 静态图片资源
│
└── docs/                 # 文档
    ├── api_documentation.md  # API文档
    └── api.js                # API客户端
```

## 开发环境配置

### 前提条件

- 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 注册 [微信小程序开发者账号](https://mp.weixin.qq.com/)

### 项目配置

1. 克隆仓库：
   ```
   git clone https://github.com/yourusername/recommendation-miniprogram.git
   ```

2. 使用微信开发者工具打开项目文件夹

3. 在 project.config.json 中配置您的 AppID

### 开发指南

1. **页面开发**：
   - 页面文件位于 `/pages` 目录下
   - 每个页面包含 .wxml, .wxss, .js, .json 四个文件

2. **API接口**：
   - API调用封装在 `/docs/api.js` 中
   - API文档见 `/docs/api_documentation.md`

3. **模拟数据**：
   - 当前版本使用模拟数据，真实环境需配置后端服务
   - 模拟数据在各页面的JS文件中定义

## 部署说明

### 测试环境

1. 在微信开发者工具中点击"预览"生成二维码
2. 使用微信扫描二维码在手机上预览小程序

### 生产环境

1. 在微信开发者工具中点击"上传"
2. 登录微信小程序后台，提交审核
3. 审核通过后发布小程序

## 后端开发

本项目前端已完成，后端需要独立开发，API规范如下：

1. 基础URL：`https://api.recommendation-app.com/v1`
2. 认证方式：JWT Token
3. 详细API文档见 `/docs/api_documentation.md`

## 开发团队

- 产品经理：XXX
- UI设计师：XXX
- 前端开发：XXX
- 后端开发：XXX
- 算法工程师：XXX

## 许可证

本项目采用 MIT 许可证 