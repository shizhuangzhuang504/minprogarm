const api = require('./../../utils/api');
const request = require('./../../utils/request');

Page({
  data: {
    realname: '',
    sex: '',
    mobile: '',
    address: '',
    door: '',
    tag: '',
    isCommon: 0,
    id: '',
    uid: '',
    controType:1
  },
  onLoad: function (opt) {
    console.log(opt)
    if (Object.keys(opt).length !== 0) {
      let { realname, sex, mobile, address, door, biao, com, id, uid, controType } = opt;
      this.setData({
        realname,
        sex,
        mobile,
        address,
        door,
        tag: biao,
        isCommon: com,
        id,
        uid,
        controType
      });
      return;
    }
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
    console.log(e);
    let { realname, sex, mobile, address, door, biao, com, tag } = e.detail.value;
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
    } else if (tag === '') {
      api.showToast({
        title: '请选择标签',
        icon: 'none'
      });
      return;
    } else {
      if (+this.data.controType === 1) {
        request.addAddress({
          ...e.detail.value
        }).then(res => {
          if (res.code == 0) {
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
      } else {
        request.updateAddress({
          ...e.detail.value
        }).then(res => {
          if (res.code) {
            api.showToast({
              title: '编辑成功',
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
  }
})