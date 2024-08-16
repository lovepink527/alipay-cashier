import { login } from './util/asyncMy.js'
import { request } from "./request/index";
App({
  async onLaunch(options) {
    console.log('App Launch', options);
    console.log('getSystemInfoSync', my.getSystemInfoSync());
    console.log('SDKVersion', my.SDKVersion);
    const { authCode } = await login()
    const loginParams = { authCode }
    const res = await request({url:"alipay/openid",data:loginParams,method:"POST"})
    console.log(res,'res')
    if(res.data.code == 200){
      my.setStorageSync({
        key: 'token',
        data: res.data.token
      })
    }
  },
  onShow() {
    console.log('App Show');
  },
  onHide() {
    console.log('App Hide');
  },
  globalData: {
    hasLogin: false,
  },
});
