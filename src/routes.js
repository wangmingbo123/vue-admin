import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Zhuce from './views/Zhuce.vue'

// 导入自己写的vue
// component
import user from './views/nav1/user.vue'
import goods from './views/nav1/goods.vue'
import category from './views/nav1/category.vue'
import order from './views/nav1/order.vue'
import information from './views/nav1/information.vue'
import sysLog from './views/nav1/log.vue'
import sysRole from './views/nav1/role.vue'
import sysPerm from './views/nav1/perm.vue'

import axios from 'axios';

axios.get('/api/getUsers')
    .then((res) => {
        var users = res.data.users;
        var str = JSON.stringify(users)
        console.log('asdasdasfsa str is ' + str)
    })
    .catch((e) => {
        console.log('asfafafav str is ' + e)
    })


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/zhuce',
        component: Zhuce,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '商城后台',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            {path: '/user', component: user, name: '用户'},
            {path: '/goods', component: goods, name: '商品'},
            {path: '/category', component: category, name: '类别'},
            {path: '/order', component: order, name: '订单'},
            {path: '/information', component: information, name: '资讯'},
            // {path: '/sysLog', component: sysLog, name: '操作日志'},
            // {path: '/sysRole', component: sysRole, name: '角色管理'},
            // {path: '/sysPerm', component: sysPerm, name: '权限管理'}
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    }
];

// 导出
export default routes;