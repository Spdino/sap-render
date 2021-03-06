import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import ElementUI from 'element-ui'

// css
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import 'normalize.css/normalize.css'

// icon
import '@/assets/icon/iconfont.css'

import '@/permission'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')