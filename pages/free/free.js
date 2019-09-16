let utils = require('./../../utils/util');

Page({
  data: {
    mobile: '',
    isUsable: false
  },
  mobileInput: function(e) {
    let {
      value
    } = e.detail;
    if (utils.checkMobile(value)) {
      this.setData({
        mobile: value,
        isUsable: true
      });
    } else {
      this.setData({
        mobile: value,
        isUsable: false
      });
    }
  },
  // 会员信息存储
  get: function() {
    if (!utils.checkMobile(this.data.mobile)) {
      request.vip()
        .then(res => {
          if (res.length) {
            wx.showToast({
              icon: 'success',
              title: '领取成功'
            })
            return;
          }
        });
    }
  }
})