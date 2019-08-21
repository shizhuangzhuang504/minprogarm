const cfg = require('./../config/index');
const api = require('./api');
const baseURL = cfg.baseURL;

let get = (op = {}) => {
  return api.request({
    url: baseURL + op.path,
    ...op,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: wx.getStorageSync('Authorization')
    },
    method: 'GET'
  }).then(res => {
    return res.data;
  });
};

let post = (op = {}) => {
  if (!op.header) {
    op.header = {}
  }
  return api.request({
    url: baseURL + op.path,
    ...op,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...op.header,
      Authorization: wx.getStorageSync('Authorization')
    },
    method: 'POST'
  }).then(res => {
    return res.data;
  });
};

exports.userLogin = data => {
  return post({
    path: '/api/wechat/auth/login',
    data: {
      ...data
    }
  })
};

exports.userLogout = () => {
  return get({
    path: '/api/wechat/auth/login',
    data: { }
  })
};

exports.getSwiper = () => {
  return get({
    path: '/api/wechat/article/comment',
    data: { }
  })
};

exports.getShopList = data => {
  return post({
    path: '/api/wechat/article/getrlist',
    data: {
      ...data
    }
  })
};

exports.getHotList = () => {
  return get({
    path: '/api/wechat/article/gethos',
    data: { }
  })
};

exports.getMenuList = () => {
  return get({
    path: '/api/wechat/article/getrmenu',
    data: { }
  })
};

exports.getMenuGoods = data => {
  return post({
    path: '/api/wechat/article/getmulist',
    data: {
      ...data
    }
  })
};

exports.addAddress = data => {
  return post({
    path: '/api/wechat/user/address',
    data: {
      ...data
    }
  })
};

exports.getAddress = () => {
  return get({
    path: '/api/wechat/user/addrlist',
    data: {}
  })
};

exports.updateAddress = data => {
  return post({
    path: '/api/wechat/user/upadress',
    data: {
      ...data
    }
  })
};

exports.delAddress = data => {
  return post({
    path: '/api/wechat/user/deldress',
    data: {
      ...data
    }
  })
};

exports.getMobile = data => {
  return post({
    path: '/api/wechat/user/getmobile',
    data: {
      ...data
    }
  })
};

exports.getUserInfo = () => {
  return get({
    path: '/api/wechat/user/getuinfo',
    data: { }
  })
};

exports.getCoupon = () => {
  return get({
    path: '/api/wechat/user/getucoupon',
    data: { }
  })
};

exports.getOrderList = () => {
  return get({
    path: '/api/wechat/user/getorder',
    data: { }
  })
};

exports.getOrderDetail = data => {
  return post({
    path: '/api/wechat/user/getorvew',
    data: {
      ...data
    }
  })
};

exports.getRebate = () => {
  return get({
    path: '/api/wechat/article/getpiont',
    data: { }
  })
};

exports.submitOrder = data => {
  return post({
    path: '/api/wechat/user/suborder',
    data: {
      ...data
    }
  })
};

exports.recharge = data => {
  return post({
    path: '/api/wechat/user/payrember',
    data: {
      ...data
    }
  })
};

exports.consume = data => {
  return get({
    path: '/api/wechat/user/getpaylog',
    data: {
      ...data
    }
  })
};