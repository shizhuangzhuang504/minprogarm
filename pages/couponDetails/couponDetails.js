const api = require('./../../utils/api');
const request = require('./../../utils/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    discount:'',
    cname:'',
    sttime:'',
    entime:'',
    info:''
  },

  onLoad: function () {
    console.log(this.changetime(1566027692616));
    api.getStorage({
      key: 'coupondetails'
    })
      .then(res => {
        console.log(res);
        if (res.data) {
          let {
            discount,
            cname,
            sttime,
            entime,
            info
          } = res.data;
          this.setData({
            discount,
            cname,
            sttime: this.changetime(sttime),
            entime: this.changetime(entime),
            info
          });
        }
      })
  },
  onShow: function () {

  },
  // 毫秒时间转换
  changetime:function(num){
    function setDb(num) {
      if (num < 10) {
        return '0' + num;
      } else {
        return '' + num;
      }
    }
    console.log(num)
    var time = new Date(num*1000);
    var year = time.getFullYear();//年
    var mon = setDb(time.getMonth() + 1);//0 
    var day = setDb(time.getDate());//24
    var res = year + "年" + mon + "月" + day + "日"
    return res;
  }
})