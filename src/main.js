import Vue from 'vue'
import axios from 'axios'
import VueRouter from 'vue-router'
import md5 from 'md5'
import App from './App.vue'
import router from './router'
import store from './store'
import globalFun from './assets/js/globalFun'
import Api from './assets/js/Api'
import moment from 'moment'
import { TablePage } from '@oit/element-ui-expand'
import './components/registry'
import './plugins'
import './styles/index.scss'
import './styles/common.css'
import 'windi.css'
Vue.prototype.$axios = axios
Vue.prototype.GLOBAL = globalFun
Vue.prototype.Api = Api
Vue.prototype.md5 = md5
Vue.prototype.$bus = new Vue()
Vue.prototype.$moment = moment
Vue.use(TablePage, {
  setFields() {
    if (sessionStorage.headTitString) {
      return JSON.parse(sessionStorage.headTitString)
    }
  }
})
Vue.config.productionTip = false
// 以下6行代码是为了解决报错：重复跳转当前路由--NavigationDuplicated: Navigating to current location ("/xxx") is not allowed
const [routerPush, routerReplace] = [VueRouter.prototype.push, VueRouter.prototype.replace]
VueRouter.prototype.push = function push(location) {
  // let history = this.currentRoute && this.currentRoute.fullPath;
  // if (location.path === history) {
  //   window.location.reload(); //整个页面都刷新
  // }
  return routerPush.call(this, location).catch(error => error)
}
VueRouter.prototype.replace = function replace(location) {
  return routerReplace.call(this, location).catch(error => error)
}
router.beforeEach((to, from, next) => {
  document.title = '宝赢轩'
  if (to.meta.requiresAuth) {
    if (sessionStorage.userId) {
      if (to.path !== '/' && to.path !== '/index') {
        const toPath = to.path.split('/')[1]
        if (sessionStorage.homeMenuPathArr.includes(toPath)) {
          next()
        } else {
          Vue.prototype.$message({
            message: '暂无访问权限',
            type: 'warning',
            duration: '3000',
          })
        }
      } else {
        next()
      }
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      })
    }
  } else {
    next()
  }
  next()
})
// 请求拦截器
axios.interceptors.request.use(
    config => {
        if (!config.headers['userId']) {
            config.headers['userId'] = sessionStorage.userId;
        }
        if (!config.headers['token']) {
            config.headers['token'] = sessionStorage.accessToken;
        }
        return config;
    },
    function(error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 响应拦截器
axios.interceptors.response.use((response) => {
    // 处理请求200的操作，默认不需要操作，可直接返回 return 返回正确信息调用接口时可以直接promise then 取到正确信息
    // console.log("response===",response)
    // if (response.data.head.status !== 0) return Promise.reject(response)
    return response;
}, (error) => {
    if (!error.response) {
        // console.log('网络超时，或者请求响应不成功，无返回状态')
        /**
         * MODIFY 网络错误应当reject而不是resolve
         * before: Promise.resolve(error)
         * after: Promise.reject(error)
         */
        return Promise.reject(error);
    }
    // 处理状态码操作
    switch (error.response.status) {
        case 401:
            // console.log('token缺失，需要重新登录');
            if (error.response.data && error.response.data.code == '3001') {
                Vue.prototype.$message({
                    message: '版本有升级,请重新登录',
                    type: 'warning'
                });
                sessionStorage.clear();
                localStorage.clear();
                router.replace({
                    path: '/login'
                })

            } else {
                //  未授权
                Vue.prototype.$message({
                    message: '发现未认证的请求，拒绝访问',
                    type: 'warning'
                });
            }
            return Promise.reject(error);
        case 403: // token过期接口直接返回403
            // console.log('token过期，需要重新登录');
            Vue.prototype.$message({
                message: '会话超时,已注销,请重新登录',
                type: 'warning'
            });
            sessionStorage.clear();
            localStorage.clear();
            router.replace({
                path: '/login'
            })
            return Promise.reject(error);
        case 400:
            // console.log('--------400------')
            break;
        case 404:
            // console.log('------404-----')
            break;
        case 500:
            // console.log('--------500-------');
            break;
        default:
            return Promise.reject(error);
    }
    // return error 返回错误
  return Promise.reject(error);
})
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
