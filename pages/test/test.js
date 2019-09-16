// pages/cart/cartList/cartList.js
Page({
  data: {
    goods: [],
    preImageUrl: '',
    hidePreview: true,
    hideCartList: true,
    colorReduce: '#80848f',
    colorAdd: '#293',
    controlSize: 32,
    listViewScrollTop: 0,
    foodAreaHeight: [0],
    cateListActiveIndex: 0
  },
  onLoad: function (options) {
    //加载数据
    // wx.showLoading({
    //   title: '正在加载数据',
    //   mask: true
    // })
    wx.request({
      url: "http://127.0.0.1:8080/goods",
      dataType: JSON,
      success: res => {
        let getgoods = JSON.parse(res.data)
        this.setData({ goods: getgoods }, () => this.setFoodListAreaHeight())
        wx.hideLoading()
      }
    })
  },

  /////////////////////////////////////////// * 下面是自定义事件 *///////////////////////////////////////////
  /////////////////////////////////////////// * 下面是自定义事件 *///////////////////////////////////////////
  /////////////////////////////////////////// * 下面是自定义事件 *///////////////////////////////////////////

  setFoodListAreaHeight() {
    let query = wx.createSelectorQuery();
    let that = this;
    //分类栏的高度
    query.select('.category_title').boundingClientRect(function (rect) {
      that.setData({
        eleCateTitleHeight: rect.height
      })
    }).exec();
    //商品item的高度
    query.select('.food').boundingClientRect(function (rect) {
      that.setData({
        eleFoodHeight: rect.height
      })
    }).exec();

    //把商品列表每个分类的区间高度计算，并放进数组
    //上面获取元素的高度可能不是同步的，所以把下面的放在setTimeout里面
    let foodAreaHeight = [0]
    let heightCount = 0
    setTimeout(() => {
      this.data.goods.forEach((item, index) => {
        heightCount += item.items.length * this.data.eleFoodHeight + this.data.eleCateTitleHeight
        foodAreaHeight.push(heightCount)
      })
      this.setData({
        foodAreaHeight
      })
    }, 100)

  },

	/**
	 * 滚动到右边的高度
	 * @param {*} e 
	 */
  scrollToCategory(e) {
    let idx = e.currentTarget.dataset.index
    let foodcount = e.currentTarget.dataset.foodcount
    this.setData({
      listViewScrollTop: this.data.foodAreaHeight[idx]
    })
  },
	/**
	 * 滚动商品的时候
	 * @param {*} event 
	 */
  foodListScrolling(event) {
    let scrollTop = event.detail.scrollTop
    let foodAreaHeight = this.data.foodAreaHeight
    foodAreaHeight.forEach((item, index) => {
      if (scrollTop >= foodAreaHeight[index] && scrollTop < foodAreaHeight[index + 1]) {
        this.setData({ cateListActiveIndex: index })
      }
    })
  },

	/**
	 * 点击图片，显示预览图
	 * @param {} e 
	 */
  bindImgPreView(e) {
    let preImageUrl = e.target.dataset.url
    this.setData({ preImageUrl, hidePreview: false })
  },
  hideIMgpreview() {
    this.setData({ preImageUrl: '', hidePreview: true })
  },

	/**
	 * 改变商品的数量 
	 */
  foodCountAdd(e) {
    let dataset = e.target.dataset
    let goods = this.data.goods
    let _key = `goods[${dataset.cidx}].items[${dataset.fidx}].count`
    let _o = goods[dataset.cidx].items[dataset.fidx]
    if (!_o.count) {
      this.setData({
        [_key]: 1
      })
    } else {
      this.setData({
        [_key]: _o.count + 1
      })
    }

  },
  foodCountReduce(e) {
    let dataset = e.target.dataset
    let goods = this.data.goods
    let _key = `goods[${dataset.cidx}].items[${dataset.fidx}].count`
    let _o = goods[dataset.cidx].items[dataset.fidx]
    if (_o.count && _o.count > 0) {
      this.setData({
        [_key]: _o.count - 1
      })
    }
  },
	/**
	 * 清空购物车
	 * 遍历goods对象，得到相关索引值，并使用setData逐个设置count为0
	 */
  clearCart() {
    let goods = this.data.goods
    let app = this
    wx.showLoading({ title: '清空购物车...' });
    this.data.goods.forEach(function (item, cidx) {
      item.items.forEach(function (foods, fidx) {
        let _key = `goods[${cidx}].items[${fidx}].count`
        app.setData({
          [_key]: 0
        })
      })
    })
    wx.hideLoading();
    this.toggleCartList()
  },
	/**
	 * 切换显示购物小车
	 */
  toggleCartList() {
    this.setData({ hideCartList: !this.data.hideCartList })
  },

	/**
	 * 提交订单
	 */
  submitOrder() {
    let _submitGoods = [];
    this.data.goods.forEach(function (item, cidx) {
      item.items.forEach(function (foods, fidx) {
        if (foods.count) {
          _submitGoods.push(foods)
        }
      })
    })
    //放入store
    wx.setStorage({
      key: 'orderGoods',
      data: JSON.stringify(_submitGoods),
      success: function () {
        wx.navigateTo({
          url: '/pages/cart/orderSubmit/orderSubmit'
        })
      }
    })
  }
})