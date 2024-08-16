import { request } from '../../request/index'
// import { throttle } from '/util';
let lastClickTime=0 ;
Page({
  data: {
    id: '',
    numbers: [],
    total: '',
    description: '',
    shopInfo: {
      name: '',
      shop_avatar: '',
      sellerid:''
    },
    input:'',
    hiddenmodalput: true
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
  pay() {
    console.log(this.data.total)
    if(!this.data.total.length){
      my.showToast({
        content: '请输入金额',
        duration: 2000
      })
      return
    }
    if(!this.isDoubleClick()){
      this.handelPay()
    }else {}
  },
  isDoubleClick() {         
    let currentTime =  Date.now();       
    let timeInterval = currentTime - lastClickTime; 
    if (0 < timeInterval&& timeInterval< 2000) {     
      return true;//如果间隔在0-1.5秒内就是快速重复点击     
    }        
    lastClickTime = currentTime;   
    return false;       
  },
  async handelPay(){
    console.log(this.data.id)
    const orderParams = {
      total: Number(this.data.total),
      shop: this.data.shopInfo.id,
      sellerid: this.data.shopInfo.sellerid,
      description: this.data.description,
      app_auth_token: this.data.shopInfo.app_auth_token
    }
    console.log(orderParams)
    // 创建订单
    const order = await request({url: "alipay/order", method:'POST',data:orderParams})
    console.log(order,'order')
    // order.data.tradeNo
    if(order.data.code !== "10000"){
      my.showModal({
        title: '提示',
        content: order.data.msg || '支付失败',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    const tradeNo = order.data.tradeNo
    const out_trade_no = order.data.outTradeNo
    my.tradePay ({
      tradeNO: tradeNo,
      success: async (res) => {
        if(res.resultCode == '9000') {
          console.log('成功', res)
          await request({url: `order/${out_trade_no}`, method:'POST',data:{ state: 1, desc: res.meme}})
        }else {
          console.log('失败', res)
          await request({url: `order/${out_trade_no}`, method:'POST',data:{ state: 2, desc: res.meme}})
        }
      },
      fail: async (error) => {
        // 关闭订单
        const params = {sellerid: this.data.shopInfo.sellerid, out_trade_no, desc: JSON.stringify(error)}
        await request({url: "alipay/order/close", method:'POST',data:params})
          console.error('调用 my.tradePay 失败: ', JSON.stringify(error));
      },
    });
  },
  async inputNumber(e) {
    const value = e.currentTarget.id
    if(value == 'del'){
      this.data.numbers.pop()
    }else if(value == 'c'){
      this.handelPay()
    }else {
      const digit = this.data.total.split('.')[0].length
      if(digit >= 5) {
        return
      }
      if(this.data.numbers.length == 0){
        const v = value === '0' || value === '00' || value === '.' ? '0.' : value
        this.data.numbers.push(v)
      }else {
        if(this.data.total.indexOf('.') > -1){
          if(this.data.total.split('.')[1].length < 2 && value !== '.'){
            const v = value === '00' ? '0' : value
            this.data.numbers.push(v)
          }
        }else {
          this.data.numbers.push(value)
        }
      }
    }
    this.setData({
      total: this.data.numbers.join('')
    })
  },
  show() {
    my.prompt({
      // title: '添加备注',
      message: '添加备注',
      placeholder: '收款人可见，最多20个字',
      okButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        this.setData({
          description: result.inputValue
        })
      },
      fail: (err) => {
        this.setData({
          description: ''
        })
      }
    });
  }
});
