import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import ElementUI from 'element-ui'

// css
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import 'normalize.css/normalize.css'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// icon
import '@/assets/icon/iconfont.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
    NProgress.start()
    if (getToken()) {
        if (to.path === '/login') {
            next({
                path: '/'
            })
            NProgress.done()
        } else {
            if (store.getters.roles.length === 0) {
                // 判断当前用户是否已拉取完user_info信息
                store
                    .dispatch('GetInfo')
                    .then(res => {
                        const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
                        store
                            .dispatch('GenerateRoutes', {
                                roles
                            })
                            .then(() => {
                                // 根据roles权限生成可访问的路由表
                                router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                                next({
                                    ...to,
                                    replace: true
                                }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                            })
                    })
                    .catch(() => {
                        store.dispatch('FedLogOut').then(() => {
                            Message.error('验证失败,请重新登录')
                            next({
                                path: '/login'
                            })
                        })
                    })
            } else {
                // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
                if (hasPermission(store.getters.roles, to.meta.roles)) {
                    next() //
                } else {
                    next({
                        path: '/401',
                        replace: true,
                        query: {
                            noGoBack: true
                        }
                    })
                }
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done() // 结束Progress
})
