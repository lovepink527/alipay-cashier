import { request } from '../../request/index'
Page({
  data: {
    id: '',
    shopInfo: {
      mobile_phone: '',
      business_address: '',
      name:'',
      id: ''
    }
  },
  async onLoad(query) {
    this.setData({  
      id: query.id  
    })
    await this.getDetailInfo(query.id)
  },
  async getDetailInfo(id) {
    my.showLoading({
      content: '加载中',
    });
    await request({url: `shop/${id}`, method:'GET'}).then((res) => {
      if(res.data.code == 200){
        this.setData({
          shopInfo: res.data.shop
        })
      }else {
        my.showToast({
          type: 'exception',
          content: '获取商户信息失败',
          duration: 3000,
        })
      }
    })
    .catch((err) => {
      my.showToast({
        type: 'exception',
        content: err,
        duration: 3000,
      })
    })
    .finally(() => {
      my.hideLoading();
    })
  },
  call () {
    const number = this.data.shopInfo.mobile_phone;
    if(number){
      my.makePhoneCall({
        phoneNumber: number,
        success:(e)=>{
          console.log(e);
        }
      })
    }else {
      my.showToast({
        content: '暂无联系方式',
        type: 'exception',
      })
    }
  },
  handlePay(e) {
    var id = e.currentTarget.dataset.id
    console.log(id)
    if(!id) {
      my.showToast({
        content: '获取商户信息错误',
        duration: 2000
      })
      return
    }
    my.navigateTo({
      url: `/page/pay/index?id=${id}`,
    })
  }
});
