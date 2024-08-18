import { createRouter, createWebHistory } from 'vue-router';
import Layout from '../layout/Layout.vue';
const routes = [
    {
        path: '/',
        name: '工作台',
        component: Layout,
        redirect: "dashboard",
        children: [
            {
                path: 'dashboard',
                name: '数据仪表',
                component: () => import('@/views/Dashboard.vue'),
                meta:{breadcrumb:'dashboard'}
            },
            {
                path: 'vul',
                name: '漏洞管理',
                component: () => import('@/views/Vul.vue'),
                meta:{breadcrumb:'vul'}
            },
            {
                path: 'assets',
                name: '资产管理',
                component: () => import('@/views/Assets.vue'),
                meta:{breadcrumb:'assets'}
            },
            {
                path: 'system',
                name: '系统管理',
                children:[
                    {   path: 'user',
                        name: '用户管理',
                        component: () => import('@/views/User.vue'),
                        meta:{breadcrumb:'user'}
                    }
                ],

            },
        ],
    },

    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.name !== 'login' && !token) {
        next({ name: 'login' });
    } else {
        next();
    }
});

export default router;
