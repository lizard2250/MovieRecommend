// pages/user/user.js
const app = getApp()
const api = require('../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    userInfo: {},
    userId: '123456'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.checkLoginStatus()
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
    // Refresh data when page is shown
    this.checkLoginStatus()
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
    this.checkLoginStatus()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        hasUserInfo: true,
        userInfo: userInfo
      })
    } else {
      this.setData({
        hasUserInfo: false,
        userInfo: {}
      })
    }
  },

  login() {
    // 模拟登录
    wx.showLoading({
      title: '登录中',
    })
    
    setTimeout(() => {
      // 模拟获取用户信息
      const userInfo = {
        nickName: '电影爱好者',
        avatarUrl: '/images/default_avatar.png'
      }
      
      wx.setStorageSync('userInfo', userInfo)
      this.setData({
        hasUserInfo: true,
        userInfo: userInfo
      })
      
      wx.hideLoading()
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })
    }, 1000)
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗?',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo')
          this.setData({
            hasUserInfo: false,
            userInfo: {}
          })
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  },

  navigateToSettings() {
    if (!this.checkLogin()) return
    
    wx.showToast({
      title: '设置功能开发中',
      icon: 'none'
    })
  },

  showFeedback() {
    wx.showToast({
      title: '反馈功能开发中',
      icon: 'none'
    })
  },

  showAbout() {
    wx.showModal({
      title: '关于我们',
      content: '本小程序由HNU it takes three Team编写\n如有问题请联系2764213578@qq.com',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  checkLogin() {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return false
    }
    return true
  }
})