// app.js
App({
  onLaunch() {
    // 启动时执行
    console.log('App Launch')
    
    // 恢复登录状态
    try {
      const userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.globalData.userInfo = userInfo
        this.globalData.hasLogin = true
      }
    } catch (e) {
      console.error('登录状态恢复失败', e)
    }
  },
  
  globalData: {
    userInfo: null,
    hasLogin: false
  }
})