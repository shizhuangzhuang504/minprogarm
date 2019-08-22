const cfg = require('./../../config/index');

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    goods: {
      type: Object,
      value: {}
    },
    number: {
      type: Number,
      value: 0
    }
  },
  data: {
    baseURL: cfg.baseURL,
    number: 0
  },
  lifetimes: {
    attached: function() {
      this.setData({
        number: this.properties.number
      });
    }
  },
  methods: {
    reduce: function(e) {
      let index = e.target.dataset.index;
      let {
        id,
        cname,
        img1,
        price,
        bprice,
        remark
      } = e.target.dataset.good;
      this.triggerEvent('goodscalc', {
        id,
        type: 'reduce',
        index,
        cname,
        img1,
        price,
        bprice,
        remark: ""
      });
    },
    add: function(e) {

      // if (wx.getStorageSync('isOutRange')) {
      let index = e.target.dataset.index
      // } else {
      //   wx.showToast({
      //     icon: "none",
      //     title: "超出服务范围"
      //   })
      // }
      let {
        id,
        cname,
        img1,
        price,
        bprice,
        remark
      } = e.target.dataset.good;
      this.triggerEvent('goodscalc', {
        id,
        type: 'add',
        index,
        cname,
        img1,
        price,
        bprice,
        remark: ""
      });
    },
    gogoodsdetail: function(e) {
      let index = e.target.dataset.index;
      let foodinfo = this.properties.goods.data[index];
      let data = JSON.stringify(foodinfo);
      wx.navigateTo({
        url: '/pages/goods-details/goods-details?data=' + data,
      })
    },
  },
})