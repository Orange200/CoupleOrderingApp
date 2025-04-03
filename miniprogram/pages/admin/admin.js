const app = getApp(); // 虽然此页面不直接用app，但保留以备将来可能需要

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [] // 订单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 可以在这里添加管理员权限校验，如果非管理员，则提示并返回
    // const adminOpenid = wx.getStorageSync('adminOpenid');
    // const currentUserOpenid = app.globalData.userInfo?.openid;
    // if (!currentUserOpenid || currentUserOpenid !== adminOpenid) {
    //   wx.showModal({
    //     title: '无权限',
    //     content: '您不是管理员，无法访问此页面。',
    //     showCancel: false,
    //     success: () => {
    //       wx.navigateBack(); // 返回上一页
    //       // 或者跳转到首页 wx.switchTab({ url: '/pages/index/index' });
    //     }
    //   });
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   * 每次进入页面都加载并处理订单数据
   */
  onShow() {
    this.loadOrders();
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
   * 添加下拉刷新功能
   */
  onPullDownRefresh() {
    this.loadOrders();
    wx.stopPullDownRefresh(); // 停止下拉刷新动画
    wx.showToast({ title: '刷新成功', icon: 'none', duration: 800 });
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
    return {
      title: '情侣点餐 - 订单管理',
      path: '/pages/index/index'
    };
  },

  // 加载并处理订单数据
  loadOrders() {
    const orders = wx.getStorageSync('orders') || [];

    // 格式化时间并按时间倒序排序
    const processedOrders = orders.map(order => {
      return {
        ...order,
        // 格式化时间为 YYYY-MM-DD HH:mm
        formattedTime: this.formatDate(new Date(order.createdAt))
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 按创建时间降序

    this.setData({ orders: processedOrders });
  },

  // 简单日期格式化函数
  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  // 完成订单操作
  completeOrder(event) {
    const { orderid } = event.currentTarget.dataset;
    if (!orderid) return;

    wx.showModal({
      title: '确认操作',
      content: '确定要将此订单标记为完成吗？',
      success: (res) => {
        if (res.confirm) {
          const orders = wx.getStorageSync('orders') || [];
          const orderIndex = orders.findIndex(o => o.orderId === orderid);

          if (orderIndex > -1) {
            orders[orderIndex].status = 'completed';
            wx.setStorageSync('orders', orders); // 更新存储
            
            // 重新加载并处理订单以更新页面
            this.loadOrders(); 
            
            wx.showToast({ title: '操作成功', icon: 'success' });
          } else {
            wx.showToast({ title: '找不到订单', icon: 'none' });
          }
        }
      }
    });
  }
}) 