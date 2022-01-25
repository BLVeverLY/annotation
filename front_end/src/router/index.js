import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'

Vue.use(Router)

const routes = [{
    //主页入口
    path: '/',
    component: Home,
    children: [{
            path: '/',
            component: resolve => require(['../views/homepage/HomePage'], resolve)
        },
        { //主页(所有文章)
            path: '/homepage',
            name: 'homepage',
            component: resolve => require(['../views/homepage/HomePage'], resolve)
        },
        { //登录
            path: '/login',
            name: 'login',
            component: resolve => require(['../views/login/Login'], resolve)
        },
        { //注册
            path: '/register',
            name: 'register',
            component: resolve => require(['../views/register/Register'], resolve)
        },
        { //任务
            path: '/task',
            name: 'task',
            component: resolve => require(['../views/task/task'], resolve)
        },
        { //关于
            path: '/about',
            name: 'about',
            component: resolve => require(['../views/about/about'], resolve)
        },
        { //单个文章页面
            path: '/task/:taskId',
            name: 'onetask',
            component: resolve => require(['../views/task/components/oneTask'], resolve),
            props: true
        },
        { //图片上传界面
            path: '/upload',
            name: 'upload',
            component: resolve => require(['../views/task/components/upload'], resolve),
            props: true
        },
        { //文件下载界面
            path: '/download',
            name: 'download',
            component: resolve => require(['../views/task/components/download'], resolve),
            props: true
        },
    ]
}, ];

const router = new Router({
    mode: 'hash',
    routes,
    //定义路由跳转时，滚动条的位置
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) { //如果存在存储过的位置，则跳回该位置（即点击浏览器回退按钮）
            return savedPosition
        } else { //没有就跳回顶部
            return { x: 0, y: 0 }
        }
    },
});

export default router;