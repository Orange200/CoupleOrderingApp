const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartItems: [], // 购物车商品列表
    totalPrice: 0, // 总价
    hasLogin: false // 登录状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   * 每次进入页面都从 Storage 加载购物车数据
   */
  onShow() {
    const cartItems = wx.getStorageSync('cart') || [];
    this.setData({
      cartItems: cartItems,
      hasLogin: app.globalData.hasLogin // 更新登录状态
    });
    this.calculateTotal();
    this.updateCartBadge();
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

  // 计算总价
  calculateTotal() {
    let totalPrice = 0;
    this.data.cartItems.forEach(item => {
      totalPrice += item.price * item.count;
    });
    this.setData({ totalPrice: totalPrice.toFixed(2) }); // 保留两位小数
  },

  // 处理商品数量变化
  handleQuantityChange(event) {
    const { id, action } = event.currentTarget.dataset;
    let cartItems = this.data.cartItems;
    const itemIndex = cartItems.findIndex(item => item.id === id);

    if (itemIndex > -1) {
      if (action === 'add') {
        cartItems[itemIndex].count += 1;
      } else if (action === 'remove') {
        if (cartItems[itemIndex].count > 1) {
          cartItems[itemIndex].count -= 1;
        } else {
          // 数量减到0，从购物车移除
          cartItems.splice(itemIndex, 1);
        }
      }
      this.setData({ cartItems: cartItems });
      this.calculateTotal();
      this.updateCartStorageAndBadge(cartItems);
    }
  },

  // 更新购物车 Storage 和 TabBar 角标
  updateCartStorageAndBadge(cartItems) {
    wx.setStorageSync('cart', cartItems);
    let totalCount = 0;
    cartItems.forEach(item => {
      totalCount += item.count;
    });
    if (totalCount > 0) {
      wx.setTabBarBadge({
        index: 1, // 购物车的 tabBar 索引
        text: String(totalCount)
      });
    } else {
      wx.removeTabBarBadge({ index: 1 });
    }
  },
  // 兼容首页的更新角标方法名
  updateCartBadge() {
      this.updateCartStorageAndBadge(this.data.cartItems);
  },

  // 模拟提交订单
  submitOrder() {
    if (!this.data.hasLogin) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再下单',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({ url: '/pages/user/user' });
          }
        }
      });
      return;
    }

    if (this.data.cartItems.length === 0) {
      wx.showToast({ title: '购物车是空的', icon: 'none' });
      return;
    }

    // --- 模拟创建订单并保存到本地存储 --- 
    const orders = wx.getStorageSync('orders') || []; // 获取历史订单，没有则为空数组
    const newOrder = {
      orderId: 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5), // 简单生成唯一订单号
      userId: app.globalData.userInfo.openid, // 用户标识
      userName: app.globalData.userInfo.nickName, // 用户昵称 （可选）
      items: this.data.cartItems,
      totalPrice: this.data.totalPrice,
      status: 'pending', // 订单状态：pending (待处理), completed (已完成) 等
      createdAt: new Date().toISOString() // 创建时间
    };

    orders.push(newOrder); // 将新订单添加到列表
    wx.setStorageSync('orders', orders); // 保存更新后的订单列表

    console.log('模拟订单已提交:', newOrder);
    console.log('所有模拟订单:', wx.getStorageSync('orders'));

    // 清空购物车
    this.setData({ cartItems: [], totalPrice: 0 });
    this.updateCartStorageAndBadge([]);

    wx.showToast({ title: '下单成功！', icon: 'success' });
    
    // 可以在下单成功后跳转到订单列表页或首页
    // setTimeout(() => {
    //   wx.switchTab({ url: '/pages/index/index' });
    // }, 1500);
  },

  // 跳转到首页
  goToIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },
}) 