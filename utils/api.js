const cfg = require('./../config/index');

let bindAPI = (apiName, bindObj = wx) => (o = {}) => new Promise((resolve, reject) => {
  bindObj[apiName](Object.assign({}, o, {
    success: resolve,
    fail: reject
  }))
});

let apiSpace = {
  net: [
    'request',
    'uploadFile',
    'downloadFile',
    'connectSocket',
    'sendSocketMessage',
    'closeSocket',
    'onSocketOpen',
    'onSocketClose',
    'onSocketMessage',
    'onSocketError'
  ],
  dataCache: [
    'getStorage',
    'getStorageSync',
    'setStorage',
    'setStorageSync',
    'removeStorage',
    'removeStorageSync',
    'clearStorage',
    'clearStorageSync',
    'getStorageInfo',
    'getStorageInfoSync'
  ],
  media: [
    'previewImage'
  ],
  share: [
    'showShareMenu'
  ],
  device: [
    'getNetworkType',
    'makePhoneCall',
    'scanCode'
  ],
  userface: [
    'showToast',
    'hideToast',
    'showLoading',
    'hideLoading',
    'showModal',
    'showActionSheet',
    'stopPullDownRefresh',
    'setNavigationBarTitle'
  ],
  openAPI: [
    'authorize',
    'login',
    'checkSession',
    'requestPayment',
    'getSetting',
    'openSetting',
    'getUserInfo'
  ],
  map: [
    'createMapContext',
    'moveToLocation',
    'translateMarker'
  ],
  route: [
    'navigateTo',
    'navigateBack',
    'redirectTo',
    'switchTab',
    'reLaunch'
  ]
}

let rawNameArr = [];

for (let key in apiSpace) {
  rawNameArr = [...rawNameArr, ...apiSpace[key]]
}

const apis = rawNameArr.reduce((accu, elt) => {
  if (Object.prototype.toString.call(elt) === '[object String]') {
    accu[elt] = bindAPI(elt)
  } else {
    accu[elt.name] = bindAPI(elt.name, elt.thisArg)
  }
  return accu;
}, {});

module.exports = apis;