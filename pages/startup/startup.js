const api = require('./../../utils/api');

Page({
  data: {
  },
  onLoad: function () {
    setTimeout(function () {
      api.switchTab({
        url: '/pages/index/index'
      });
    }, 3000);
  }
})