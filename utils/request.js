const cfg = require("./../config/index");
const api = require("./api");
const baseURL = cfg.baseURL;

let get = (op = {}) => {
  let userInfo = wx.getStorageSync("userInfo");
  return api
    .request({
      url: baseURL + op.path,
      ...op,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: userInfo.Authorization
      },
      method: "GET"
    })
    .then(res => {
      return res.data;
    });
};

let post = (op = {}) => {
  let userInfo = wx.getStorageSync("userInfo");
  if (!op.header) {
    op.header = {};
  }
  return api
    .request({
      url: baseURL + op.path,
      ...op,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...op.header,
        Authorization: userInfo.Authorization
      },
      method: "POST"
    })
    .then(res => {
      return res.data;
    });
};

exports.userLogin = data => {
  return post({
    path: "/api/wechat/auth/login",
    data: {
      ...data
    }
  });
};

exports.userLogout = () => {
  return get({
    path: "/api/wechat/auth/login",
    data: {}
  });
};

// 首页轮播图
exports.getSwiper = () => {
  return get({
    path: "/api/wechat/article/home_images",
    data: {}
  });
};
// 获取店铺信息
exports.getShopList = data => {
  return get({
    path: "/api/wechat/lately_restaurant",
    data: {
      ...data
    }
  });
};

exports.getHotList = () => {
  return get({
    path: "/api/wechat/article/gethos",
    data: {}
  });
};

// 获取免费优惠券
exports.getFreeCoupon = () => {
  return get({
    path: "/api/wechat/user/free_coupon",
    data: {}
  });
};
// 获取免费优惠券
exports.getAuthFreeCoupon = () => {
  return get({
    path: "/api/wechat/free_coupon_no_auth",
    data: {}
  });
};
// 领取优惠券
exports.receiveCouponList = () => {
  return get({
    path: "/api/wechat/user/receive_free_coupon",
    data: {}
  });
};

exports.getMenuList = () => {
  return get({
    path: "/api/wechat/article/getrmenu",
    data: {}
  });
};

exports.getMenuGoods = data => {
  return post({
    path: "/api/wechat/article/getmulist",
    data: {
      ...data
    }
  });
};

exports.addAddress = data => {
  return post({
    path: "/api/wechat/user/add_address",
    data: {
      ...data
    }
  });
};

exports.getAddress = () => {
  return get({
    path: "/api/wechat/user/address_list",
    data: {}
  });
};

exports.updateAddress = data => {
  return post({
    path: "/api/wechat/user/edit_address",
    data: {
      ...data
    }
  });
};

exports.delAddress = data => {
  return post({
    path: "/api/wechat/user/del_address",
    data: {
      ...data
    }
  });
};

exports.getMobile = data => {
  return post({
    path: "/api/wechat/user/getmobile",
    data: {
      ...data
    }
  });
};

exports.getUserInfo = () => {
  return get({
    path: "/api/wechat/user/info",
    data: {}
  });
};

exports.getCoupon = () => {
  return get({
    path: "/api/wechat/user/getucoupon",
    data: {}
  });
};

exports.getOrderList = () => {
  return get({
    path: "/api/wechat/user/getorder",
    data: {}
  });
};

exports.getOrderDetail = data => {
  return post({
    path: "/api/wechat/user/getorvew",
    data: {
      ...data
    }
  });
};

exports.getRebate = () => {
  return get({
    path: "/api/wechat/article/getpiont",
    data: {}
  });
};

/** 获取优惠券列表 **/
exports.getCouponList = () => {
  return get({
    path: "/api/wechat/user/coupon_list",
    data: {}
  });
};

/** 获取免费券 **/
exports.getFreeList = () => {
  return get({
    path: "/api/wechat/user/free_coupon",
    data: {}
  });
};

exports.submitOrder = data => {
  return post({
    path: "/api/wechat/user/suborder",
    data: {
      ...data
    }
  });
};

exports.recharge = data => {
  return post({
    path: "/api/wechat/user/payrember",
    data: {
      ...data
    }
  });
};

exports.consume = data => {
  return get({
    path: "/api/wechat/user/getpaylog",
    data: {
      ...data
    }
  });
};
