export const login = () => {
  return new Promise((resolve, reject) => {
    my.getAuthCode({
      timeout: 3000,
      success: (res) => {
        resolve(res)
      },
      fail:(err) => {
        reject(err)
      },
      complete: () => {}
    })
  })
}

export const requestPayment = (pay) => {
  return new Promise((resolve, reject) => {
    my.requestPayment({
      ...pay,
      success: (res) => {
        resolve(res)
      },
      fail:(err) => {
        reject(err)
      },
      complete: () => {}
    })
  })
}