const api = require('./../../utils/api');
const request = require('./../../utils/request');

Page({
  data: {
    sex: '',
    address: '',
    tag: '',
    isCommon: 0
  },
  chooseSex: function (e) {
    let { sex } = e.currentTarget.dataset;
    this.setData({
      sex
    });
  },
  chooseLocation: function () {
    api.chooseLocation()
    .then(res => {
      this.setData({
        address: res.address
      });
    });
  },
  chooseTag: function (e) {
    let { tag } = e.currentTarget.dataset;
    this.setData({
      tag
    });
  },
  chooseCommon: function () {
    this.setData({
      isCommon: this.data.isCommon === 0 ? 1 : 0
    });
  },
  saveAddress: function (e) {
    let { realname, sex, mobile, address, door, biao, com  } = e.detail.value;
    if (realname === '') {
      api.showToast({
        title: '联系人不能为空',
        icon: 'none'
      });
      return;
    } else if (sex === '') {
      api.showToast({
        title: '请选择性别',
        icon: 'none'
      });
      return;
    } else if (mobile === '') {
      api.showToast({
        title: '请填写手机号码',
        icon: 'none'
      });
      return;
    } else if (address === '') {
      api.showToast({
        title: '请选择地址',
        icon: 'none'
      });
      return;
    } else if (door === '') {
      api.showToast({
        title: '请填写门牌号',
        icon: 'none'
      });
      return;
    } else if (biao === '') {
      api.showToast({
        title: '请选择标签',
        icon: 'none'
      });
      return;
    } else {
      request.addAddress({
        ...e.detail.value
      }).then(res => {
        if (res.status_code) {
          api.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 1000
          }).then(res => {
            api.navigateBack({
              delta: 1
            });
          });
        }
      });
    }
  }
})