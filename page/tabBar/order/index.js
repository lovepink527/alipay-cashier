import { request } from '../../../request/index'
import { formatTime } from '../../../util/index'
Page({
  data: {
    top: 0,
    page: 1,
    total: 1,
    loading: false,
    list: []
  },
  async onPullDownRefresh() {
    this.setData({
      page: 1 //当前页的一些初始数据，视业务需求而定
    })
    await this.onLoad(); //重新加载onLoad()
    my.stopPullDownRefresh()
  },
  onLoad() {
    my.getSystemInfo({
      success: (res) => {
        if (res.statusBarHeight && res.titleBarHeight) {
          this.setData({
            top: res.statusBarHeight + res.titleBarHeight,
          });
        }
      },
    });
    this.getOrderList(1)
  },
  onReachBottom() {
    // 下拉触底，先判断是否有请求正在进行中
    // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
    if (!this.data.loading && this.data.page < (this.data.total/5 + 1)) {
      this.getList(this.data.page + 1)
    }else {
      my.showToast({
        content: '没有更多数据了'
      })
    }
  },
  async getOrderList(page) {
    this.data.loading = true
    my.showLoading({
      content: '加载中',
    });
    await request({url:`order?page=${page}&state=${1}`,method:"GET"}).then((res) => {
      console.log('res',res)
      const newList = res.data.list.map((item) =>{
        let newItem = item
        newItem.created_at = formatTime(new Date(item.created_at))
        return newItem
      })
      if(res.data.code == 200){
        this.setData({
          page: page,     //当前的页号
          pages: res.data.total,  //总页数
          list: page == 1 ? newList : this.data.list.concat(newList)
        })
      }else {
        my.showToast({
          type: 'exception',
          content: '获取订单信息失败',
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
      this.data.loading = false
      my.hideLoading();
    })
  },
});
