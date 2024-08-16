
import { request } from '../../../request/index'
Page({
  data: {
    page: 1,
    total: 1,
    list: [],
    loading: false,
    top: 0,
  },
  onLoad() {
    this.getList(1)
    my.getSystemInfo({
      success: (res) => {
        if (res.statusBarHeight && res.titleBarHeight) {
          this.setData({
            top: res.statusBarHeight + res.titleBarHeight,
          });
        }
      },
    });
  },
  async onPullDownRefresh() {
    this.setData({
      page: 1 //当前页的一些初始数据，视业务需求而定
    })
    await this.onLoad(); //重新加载onLoad()
    my.stopPullDownRefresh()
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
  async getList(page) {
    this.data.loading = true
    my.showLoading({
      content: '加载中',
    });
    await request({url:`shop?page=${page}`,method:"GET"}).then((res) => {
      console.log('res',res)
      const newList = res.data.list
      if(res.data.code == 200){
        this.setData({
          page: page,     //当前的页号
          pages: res.data.total,  //总页数
          list: page == 1 ? newList : this.data.list.concat(newList)
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
      this.data.loading = false
      my.hideLoading();
    })
  },
  handleDetail(e) {
    var id = e.currentTarget.dataset.id
    if(!id) {
      wx.showToast({
        content: '获取商户信息错误',
        duration: 2000
      })
      return
    }
    my.navigateTo({
      url: `/page/detail/index?id=${id}`,
    })
  }
});
