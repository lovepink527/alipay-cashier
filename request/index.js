
export const envFn = () => {
  return new Promise((resolve, reject) => {
    my.getRunScene({
      success(res) {
          resolve(res.envVersion)
      },
      fail(err) {
          reject(err)
      }
  });
  })
}

const baseApi = {
  // 开发版 
  // develop: "http://localhost:8088/api/",
  develop: "https://moneyshop.cc/api/",
  // 体验版
  trial: "https://moneyshop.cc/api/",
  // 正式版
  release: "https://moneyshop.cc/api/"
};

export const request= async (params) => {
  const env = await envFn()
  const api = baseApi[env]
  const {url} = params;
  const token = my.getStorageSync({ key: 'token' });
  return new Promise((resolve,reject) => {
    my.request({
      ...params,
      headers: {
        authorization: token.data,
        secret: 'Bearer 313d594e90b6fd7d50c1e08c73fd31be'
      },
      url: `${api}${url}`,
      success:(result) => {
        resolve(result)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
}