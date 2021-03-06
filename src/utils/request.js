import axios from 'axios'
import {
    Message,
    MessageBox
} from 'element-ui'
import store from '../store'
import {
    getToken
} from '@/utils/auth'
import {
    Loading
} from 'element-ui'

// 创建axios实例
const service = axios.create({
    baseURL:'https://www.easy-mock.com/mock/5ae01eb98c38ea1e0b35fc6a/render', // api的base_url
    timeout: 150000 // 请求超时时间
})

const DELAY = 300
let timer, loadingInstance

// request拦截器
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        }

        // 全局请求的 loading，当请求 300 ms 后还没返回，才会出现 loading
        clearTimeout(timer)
        timer = setTimeout(() => {
            loadingInstance = Loading.service({
                fullscreen: true
            })
        }, DELAY)
        return config
    },
    error => {
        clearTimeout(timer)
        if (loadingInstance) {
            loadingInstance.close()
        }

        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)

// respone拦截器
service.interceptors.response.use(
    response => {
        clearTimeout(timer)
        if (loadingInstance) {
            loadingInstance.close()
        }
        /**
         * code为非20000是抛错 可结合自己业务进行修改
         */
        const res = response.data
        if (res.code !== 20000 && res.code) {
            Message({
                message: res.data,
                type: 'error',
                duration: 5 * 1000
            })

            // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload() // 为了重新实例化vue-router对象 避免bug
                    })
                })
            }
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        clearTimeout(timer)
        if (loadingInstance) {
            loadingInstance.close()
        }

        console.log('err:' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
