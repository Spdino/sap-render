import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.getters.name) {
    if (to.path === '/login') {
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      next()
      NProgress.done()
    }
  } else {
    if (to.path === '/') {
      next('/login')
      NProgress.done()
    } else {
      next()
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})