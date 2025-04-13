const app = getApp();

// 模拟菜单数据
const menuData = [
  {
    id: 1,
    name: '豆角焖面',
    price: 18.8,
    images: ['../../images/menu/item1.png', '../../images/menu/item1-detail1.png'],
    description: '精选新鲜豆角，搭配劲道面条，焖制而成，口感鲜美，营养丰富。',
    ingredients: [
      { name: '面条', amount: '200g' },
      { name: '豆角', amount: '150g' },
      { name: '猪肉', amount: '100g' },
      { name: '酱油', amount: '适量' },
      { name: '盐', amount: '适量' },
      { name: '蒜末', amount: '适量' },
      { name: '姜片', amount: '适量' },
      { name: '料酒', amount: '适量' },
      { name: '食用油', amount: '适量' }
    ],
    count: 0
  },
  {
    id: 2,
    name: '可乐鸡翅',
    price: 28.8,
    images: ['../../images/menu/item2.png', '../../images/menu/item2-detail1.png'],
    description: '选用新鲜鸡翅，搭配可乐秘制酱料，口感鲜嫩，甜而不腻。',
    ingredients: [
      { name: '鸡翅', amount: '8个' },
      { name: '可乐', amount: '1罐' },
      { name: '姜片', amount: '适量' },
      { name: '料酒', amount: '适量' },
      { name: '酱油', amount: '适量' },
      { name: '八角', amount: '2个' },
      { name: '桂皮', amount: '1段' },
      { name: '盐', amount: '适量' }
    ],
    count: 0
  },
  {
    id: 3,
    name: '红烧排骨',
    price: 38.8,
    images: ['../../images/menu/item3.png', '../../images/menu/item3-detail1.png'],
    description: '精选猪肋排，红烧入味，肉质鲜嫩，酱香浓郁。',
    ingredients: [
      { name: '猪肋排', amount: '500g' },
      { name: '姜片', amount: '适量' },
      { name: '大蒜', amount: '适量' },
      { name: '酱油', amount: '适量' },
      { name: '料酒', amount: '适量' },
      { name: '冰糖', amount: '适量' },
      { name: '八角', amount: '2个' },
      { name: '桂皮', amount: '1段' },
      { name: '盐', amount: '适量' }
    ],
    count: 0
  },
  {
    id: 4,
    name: '江西炒米粉',
    price: 16.8,
    images: ['../../images/menu/item4.png', '../../images/menu/item4-detail1.png'],
    description: '江西特色炒米粉，米粉劲道，配料丰富，香辣可口。',
    ingredients: [
      { name: '米粉', amount: '200g' },
      { name: '豆芽', amount: '100g' },
      { name: '韭菜', amount: '50g' },
      { name: '辣椒', amount: '适量' },
      { name: '酱油', amount: '适量' },
      { name: '蒜末', amount: '适量' },
      { name: '姜末', amount: '适量' },
      { name: '盐', amount: '适量' },
      { name: '食用油', amount: '适量' },
      { name: '辣椒酱', amount: '适量' }
    ],
    count: 0
  },
  {
    id: 5,
    name: '肉末茄子',
    price: 22.8,
    images: ['../../images/menu/item5.png', '../../images/menu/item5-detail1.png'],
    description: '茄子软糯，肉末鲜香，搭配秘制酱料，下饭佳品。',
    ingredients: [
      { name: '茄子', amount: '2个' },
      { name: '猪肉末', amount: '150g' },
      { name: '蒜末', amount: '适量' },
      { name: '酱油', amount: '适量' },
      { name: '盐', amount: '适量' },
      { name: '料酒', amount: '适量' },
      { name: '葱花', amount: '适量' },
      { name: '食用油', amount: '适量' },
      { name: '辣椒', amount: '适量' }
    ],
    count: 0
  }
];

Page({
  data: {
    food: null,
    totalPrice: 0,
    isPreview: false
  },

  onLoad(options) {
    const foodId = parseInt(options.id);
    this.getFoodDetail(foodId);
  },

  getFoodDetail(foodId) {
    const food = menuData.find(item => item.id === foodId) || menuData[0];
    this.setData({
      food: food,
      totalPrice: food.price * food.count
    });
  },

  toggleImagePreview() {
    this.setData({
      isPreview: !this.data.isPreview
    });
  },

  addToCart() {
    const food = this.data.food;
    food.count += 1;
    this.setData({
      food: food,
      totalPrice: food.price * food.count
    });
    this.updateCart();
  },

  removeFromCart() {
    const food = this.data.food;
    if (food.count > 0) {
      food.count -= 1;
      this.setData({
        food: food,
        totalPrice: food.price * food.count
      });
      this.updateCart();
    }
  },

  updateCart() {
    const cart = wx.getStorageSync('cart') || [];
    const index = cart.findIndex(item => item.id === this.data.food.id);
    
    if (this.data.food.count > 0) {
      if (index === -1) {
        cart.push(this.data.food);
      } else {
        cart[index] = this.data.food;
      }
    } else if (index !== -1) {
      cart.splice(index, 1);
    }
    
    wx.setStorageSync('cart', cart);
  }
});