import { bindingPhone} from '../../api/api.js';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '瓦舍茶馆',
      'color': true,
      'class': '1'
    },
    disabled: false,
    active: false,
    timetext: '获取验证码',
    userInfo: {},
    phone: '',
    key: '',
    imagesCode: false,
    httpUrl: '',
    captchaimg: ''
  },
  
  //绑定手机
  getPhoneNumber: function (e) {
    // var _this = this;
    bindingPhone({
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }).then(res=>{
      return app.Tips({ title: res.msg, icon: 'success' }, { tab: 5, url: '/pages/user_info/index' });
    }).catch(err => { return app.Tips({ title: err }); })
    return;
    wx.request({
      url: _this.data.phoneUrl,
      data: {
        // userid: app.globalData.member.id,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: function (res) {
        if (res.data.code == 200) {
          app.globalData.member = res.data.data;
          wx.showToast({ title: res.data.msg, icon: 'success', duration: 1000 });
        } else {
          console.log(res);
          wx.showToast({ title: res.data.msg, icon: 'none', duration: 1000 });
        }
      }
    });
  },



  // 获取key值；
  getVerifyCode: function () {
    let that = this;
    verifyCode().then(res => {
      that.setData({
        key: res.data.key,
        httpUrl: app.globalData.url + '/api/sms_captcha?key=' + res.data.key
      })
    }).catch(err => {
      return app.Tips({ title: err.msg });
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getVerifyCode();
  },
  imagesCodeTap: function () {
    this.setData({
      httpUrl: this.data.httpUrl + '&' + Date.parse(new Date())
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})