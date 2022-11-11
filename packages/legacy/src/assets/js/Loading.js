import { Loading } from 'element-ui'

let loading = null
const showLoading = (params) => {
  console.log('target====', params)
  if (loading) {
    loading.close()
  }
  const options = {
    fullscreen: false,
    target: document.querySelector(params),
    lock: true,
    text: '小易拼命加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
  }
  Object.assign(
    options,
    params,
  )
  loading = Loading.service(options)
}
const hideLoading = () => {
  loading.close()
}
export {
  showLoading,
  hideLoading,
}
