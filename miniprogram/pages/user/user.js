// 获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasLogin: false,
    isAdmin: false,
    motto: 'Hello Sweetie~'
  },
  
  onLoad() {
    // 页面加载时执行
  },
  
  onShow() {
    // 每次显示页面时检查登录状态
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasLogin: app.globalData.hasLogin
      })
      
      // 设置为管理员状态
      this.setData({
        isAdmin: true
      })
    }
  },
  
  // 登录按钮点击
  login() {
    // 模拟登录过程
    const mockUserInfo = {
      avatarUrl: '/images/avatar_mock.png',
      nickName: '用户' + Math.floor(Math.random() * 100),
      openid: 'openid_' + Date.now()
    }
    
    // 更新全局数据
    app.globalData.userInfo = mockUserInfo
    app.globalData.hasLogin = true
    
    // 保存到本地存储
    wx.setStorageSync('userInfo', mockUserInfo)
    
    // 更新页面数据
    this.setData({
      userInfo: mockUserInfo,
      hasLogin: true,
      isAdmin: true
    })
    
    // 设置管理员ID
    wx.setStorageSync('adminOpenid', mockUserInfo.openid)
    
    wx.showToast({
      title: '登录成功',
      icon: 'success'
    })
  },
  
  // 退出登录
  logout() {
    // 清除全局数据
    app.globalData.userInfo = null
    app.globalData.hasLogin = false
    
    // 清除本地存储
    wx.removeStorageSync('userInfo')
    
    // 更新页面数据
    this.setData({
      userInfo: {},
      hasLogin: false,
      isAdmin: false
    })
    
    wx.showToast({
      title: '已退出登录',
      icon: 'none'
    })
  },
  
  // 跳转到管理页面
  goToAdmin() {
    wx.navigateTo({
      url: '../admin/admin'
    })
  }
})