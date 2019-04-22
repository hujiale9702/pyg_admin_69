import axios from 'axios'
// 设置公共url
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'

// 设置拦截器
axios.interceptors.request.use(config => {
  // 给config添加新的信息
  // config可以给请求头追加属性
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(res => {
  // 判断 token 是否失效
  if (res.data.meta.status === 401) {
    location.href = '#/login'
  } else {
    return res
  }
})

// 导出axios
export default axios
