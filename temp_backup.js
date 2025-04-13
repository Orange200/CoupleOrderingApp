const app = getApp();

Page({
  data: {
    food: null,
    totalPrice: 0,
    isImagePreview: false
  },

  onLoad: function(options) {
    // 从页面参数中获取餐品ID
    const foodId = parseInt(options.id);
    // 获取餐品详情
    this.getFoodDetail(foodId);
  },

  getFoodDetail: function(foodId) {
    // 模拟菜单数据
    const menuData = {
      1: {
        id: 1,
        name: '豆角焖面',
        price: 15,
        image: '/images/menu/item1.png',
        description: '面条和豆角同锅焖煮，面条吸收了豆角的香气和猪肉的鲜美，味道浓郁。焖煮过程中，酱油和调味料的完美融合让菜肴更具深度和丰富的口感。',
        count: 0
      },
      2: {
        id: 2,
        name: '可乐鸡翅',
        price: 58,
        image: '/images/menu/item2.png',
        description: '鸡翅与可乐一同炖煮，肉质鲜嫩，酱汁黏稠甘甜，口感独特，鸡翅的香味与可乐的甜味交织，适合家庭聚会或者聚餐时食用。',
        count: 0
      },
      3: {
        id: 3,
        name: '红烧排骨',
        price: 68,
        image: '/images/menu/item3.png',
        description: '排骨通过红烧的方式慢炖，外焦里嫩，色泽红亮，酱汁浓郁甜美，吃上一口肉质松软，味道浓烈，带有微微的甜味和酱香。',
        count: 0
      },
      4: {
        id: 4,
        name: '江西炒米粉',
        price: 15,
        image: '/images/menu/item4.png',
        description: '具有浓厚江西风味的米粉炒菜，米粉韧性十足，配料丰富，炒至香脆入味，略带辣味，带有浓烈的酱香，适合喜爱重口味的食客。',
        count: 0
      },
      5: {
        id: 5,
        name: '肉末茄子',
        price: 38,
        image: '/images/menu/item5.png',
        description: '经典的家常菜，茄子炒至软糯入味，搭配猪肉末的鲜香，调味料丰富，味道香浓。',
        count: 0
      }
    };

    // 获取对应ID的餐品数据
    const food = menuData[foodId] || menuData[1]; // 如果找不到对应ID，默认显示第一个
    this.setData({ 
      food,
      totalPrice: food.price * food.count
    });
  },

  toggleImagePreview: function() {
    this.setData({
      isImagePreview: !this.data.isImagePreview
    });
  },

  addToCart: function() {
    const food = this.data.food;
    food.count += 1;
    this.setData({ 
      food,
      totalPrice: food.price * food.count
    });
    
    // 更新购物车
    this.updateCart(food, 'add');
    
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  },

  removeFromCart: function() {
    const food = this.data.food;
    if (food.count > 0) {
      food.count -= 1;
      this.setData({ 
        food,
        totalPrice: food.price * food.count
      });
      
      // 更新购物车
      this.updateCart(food, 'remove');
    }
  },

  updateCart: function(item, action) {
    let cart = wx.getStorageSync('cart') || [];
    const cartItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

    if (action === 'add') {
      if (cartItemIndex > -1) {
        cart[cartItemIndex].count += 1;
      } else {
        cart.push({ ...item, count: 1 });
      }
    } else if (action === 'remove') {
      if (cartItemIndex > -1) {
        if (cart[cartItemIndex].count > 1) {
          cart[cartItemIndex].count -= 1;
        } else {
          cart.splice(cartItemIndex, 1);
        }
      }
    }

    wx.setStorageSync('cart', cart);
    
    // 更新购物车角标
    const totalCount = cart.reduce((sum, item) => sum + item.count, 0);
    if (totalCount > 0) {
      wx.setTabBarBadge({
        index: 1,
        text: String(totalCount)
      });
    } else {
      wx.removeTabBarBadge({ index: 1 });
    }
  }
}); 