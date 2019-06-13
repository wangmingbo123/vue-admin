import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

// 创建router实例
const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {

    console.log('to ' + to.path)
    console.log('to ' + to.name)
    console.log('from ' + from.name)
    console.log('from ' + from.name)
    if (to.path == '/login') {
        var str = sessionStorage.getItem('user');
        console.log('user path  ' + to.path)
        console.log('user from sessionStorage ' + str)
        sessionStorage.removeItem('user');
    }


    var str = sessionStorage.getItem('user');

    console.log('user path  ' + to.path)
    console.log('user from sessionStorage ' + str)
    console.log('user from sessionStorage ' + typeof str)


    if (!str && to.path != '/login') {
        next({path: '/login'})
    } else {
        console.log('路由成功')
        next()
    }
})


// 挂载router

new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app')

