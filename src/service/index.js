
import axios from 'axios';
import { Message, Loading } from 'element-ui'; //引入单个消息弹窗组件
import local from '@/utils/local';
import router from '@/router'   //引入路由，index是关键词，会自动匹配

// const BASE_URL = ''

// const service = axios.create({
//   baseURL: BASE_URL,
//   timeout: 5000,
//   headers: {
//     'Content-Type': contentType,
//     'X-Requested-With': 'XMLHttpRequest'
//   }
// })

//设置统一的服务器地址
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://192.168.115.7:8089/api/app/kskt-mes' : '/api/app/kskt-mes'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = localStorage.getItem('token') || undefined
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.timeout = 15000
// axios.defaults.headers['Access-Control-Allow-Origin'] = 'http://172.16.0.150:8081/hl-blood-service'

let loadinginstace; //load加载

// 请求拦截
axios.interceptors.request.use(config => {
  console.log('请求拦截 config', config)
  //从本地拿到令牌
  let token = local.get('token') || undefined
  if (token) {
    //将令牌挂到config.headers.Authorization上，后面所有的请求都必须携带令牌
    config.headers.Authorization = token;
    config.headers.token = token
  }
  loadinginstace = Loading.service({
    fullscreen: true
  }) // 请求打开loading
  return config;
}, err => {
  console.log('请求拦截 err', err)
  Message({
    showClose: true,
    duration: '2000',
    message: '请求失败',
    type: 'error'
  })
  return Promise.reject(err)
})
function isPC() {
  let flag = window.navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
  if (flag) {
    console.log('非pc')
    return false;
  }
  console.log('pc')
  return true;
}

// 响应拦截
axios.interceptors.response.use(function (response) {
  console.log('响应拦截 response', response)
  // 对响应数据做点什么
  if (response.data.code == 401) {
    Message({
      showClose: true,
      duration: '2000',
      message: response.data.msg,
      type: 'error'
    })
    if (!isPC()) {
      router.push({
        path: '/pad/login'
      })
      return
    }
    router.push({
      path: '/pc/login'
    })
  }
  loadinginstace.close();
  return response;
}, function (error) {
  console.log('响应拦截 err', error)
  Message({
    showClose: true,
    duration: '2000',
    message: "请求错误",
    type: 'error'
  })
  if (loadinginstace) loadinginstace.close();
  // if (!isPC()) {
  //   router.push({
  //     path: '/pad/login'
  //   })
  //   return
  // }
  // router.push({
  //   path: '/pc/login'
  // })
  return Promise.reject(error);
});

//暴露出去
export default axios