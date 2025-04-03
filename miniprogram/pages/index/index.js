const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuItems: [], // 菜单项
    cart: [], // 购物车（简单模拟，后续可以移到 globalData 或 Storage）
    totalPrice: 0, // 总价
    totalCount: 0 // 总数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 加载模拟菜单数据
    this.loadMenuData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示页面时，可以考虑重新计算购物车角标等
    this.updateCartBadge(); 
  },

  // 加载模拟菜单数据
  loadMenuData() {
    // --- 在实际应用中，这里会从后端 API 获取菜单数据 --- 
    const mockMenu = [
      { id: 1, name: '豆角焖面', price: 15, image: '/images/menu/item1.png', description: '面条和豆角同锅焖煮，面条吸收了豆角的香气和猪肉的鲜美，味道浓郁。焖煮过程中，酱油和调味料的完美融合让菜肴更具深度和丰富的口感。', count: 0 },
      { id: 2, name: '可乐鸡翅', price: 58, image: '/images/menu/item2.png', description: '鸡翅与可乐一同炖煮，肉质鲜嫩，酱汁黏稠甘甜，口感独特，鸡翅的香味与可乐的甜味交织，适合家庭聚会或者聚餐时食用。', count: 0 },
      { id: 3, name: '红烧排骨', price: 68, image: '/images/menu/item3.png', description: '排骨通过红烧的方式慢炖，外焦里嫩，色泽红亮，酱汁浓郁甜美，吃上一口肉质松软，味道浓烈，带有微微的甜味和酱香。', count: 0 },
      { id: 4, name: '江西炒米粉', price: 15, image: '/images/menu/item4.png', description: '具有浓厚江西风味的米粉炒菜，米粉韧性十足，配料丰富，炒至香脆入味，略带辣味，带有浓烈的酱香，适合喜爱重口味的食客。', count: 0 },
      { id: 5, name: '肉末茄子', price: 38, image: '/images/menu/item5.png', description: '经典的家常菜，茄子炒至软糯入味，搭配猪肉末的鲜香，调味料丰富，味道香浓。', count: 0 }
      // 添加更多菜品...
    ];
    // 需要在 /images/menu/ 目录下准备对应的图片
    this.setData({ menuItems: mockMenu });
  },

  // 添加到购物车
  addToCart(event) {
    const itemId = event.currentTarget.dataset.id;
    const menuItems = this.data.menuItems;
    const itemIndex = menuItems.findIndex(item => item.id === itemId);

    if (itemIndex > -1) {
      menuItems[itemIndex].count += 1;
      this.updateCart(menuItems[itemIndex], 'add');
      this.setData({ menuItems: menuItems }); // 更新菜单项的显示数量
    }
  },

  // 从购物车减少
  removeFromCart(event) {
    const itemId = event.currentTarget.dataset.id;
    const menuItems = this.data.menuItems;
    const itemIndex = menuItems.findIndex(item => item.id === itemId);

    if (itemIndex > -1 && menuItems[itemIndex].count > 0) {
      menuItems[itemIndex].count -= 1;
      this.updateCart(menuItems[itemIndex], 'remove');
      this.setData({ menuItems: menuItems }); // 更新菜单项的显示数量
    }
  },

  // 更新购物车数据和总价/总数
  updateCart(item, action) {
    let cart = this.data.cart;
    let totalPrice = this.data.totalPrice;
    let totalCount = this.data.totalCount;
    const cartItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

    if (action === 'add') {
      if (cartItemIndex > -1) {
        cart[cartItemIndex].count += 1;
      } else {
        // 第一次添加时，item里已经有count=1了，但购物车里还没有
        // 需要创建一个新的对象加入购物车，数量设为1
        cart.push({ ...item, count: 1 }); 
      }
      totalPrice += item.price;
      totalCount += 1;
    } else if (action === 'remove') {
      if (cartItemIndex > -1) {
        // 这里的 item.count 是菜单列表项的数量，可能不准确
        // 应该用 cart[cartItemIndex].count 判断
        if (cart[cartItemIndex].count > 1) {
          cart[cartItemIndex].count -= 1;
        } else {
          cart.splice(cartItemIndex, 1); // 数量减到0，从购物车移除
        }
        totalPrice -= item.price;
        totalCount -= 1;
      }
    }

    this.setData({
      // 注意：这里更新的是首页的临时购物车cart，它只在添加时被修改
      // 购物车页面直接读取Storage，所以这里可以不清空，但为了逻辑清晰可以考虑也同步
      // cart: cart, 
      totalPrice: totalPrice,
      totalCount: totalCount
    });

    // 更新购物车角标
    this.updateCartBadge(totalCount); // 传递 totalCount
    
    // --- 将更新后的购物车数据保存到 Storage --- 
    wx.setStorageSync('cart', cart); 
    console.log('Cart updated in storage:', wx.getStorageSync('cart'));
  },

  // 更新 TabBar 购物车角标
  updateCartBadge(count) { // 接受count参数
    // 如果没有传入 count，则从 data 中获取
    const totalCount = (typeof count === 'number') ? count : this.data.totalCount;
    if (totalCount > 0) {
      wx.setTabBarBadge({
        index: 1, // 购物车的 tabBar 索引，从0开始
        text: String(totalCount)
      });
    } else {
      wx.removeTabBarBadge({ index: 1 });
    }
  },

  // 跳转到购物车页面
  goToCart() {
    // 将购物车数据传递给购物车页面
    // 注意：页面跳转传递数据大小有限制，复杂数据建议用 Storage 或 globalData
    // 这里为了简单，暂时直接存在页面 data 中，跳转时不传递，购物车页自己管理或读取 Storage
    wx.switchTab({ // 跳转到 tabBar 页面需要用 switchTab
      url: '../cart/cart'
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '快来看看我们的情侣菜单吧！',
      path: '/pages/index/index'
    }
  }
}) 