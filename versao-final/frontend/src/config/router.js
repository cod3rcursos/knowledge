import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import ArticlesByCategory from '@/components/articles/ArticlesByCategory'
import ArticleById from '@/components/articles/ArticleById'
import AdminPage from '@/components/admin/AdminPage'
import Auth from '@/components/auth/Auth'

Vue.use(VueRouter)

const routes = [{
    name: 'home',
    path: '/',
    component: Home,
    meta: { requiresAuth: true }
}, {
    name: 'articlesByCategory',
    path: '/categories/:id/articles',
    component: ArticlesByCategory,
    props: true,
    meta: { requiresAuth: true }
}, {
    name: 'articlesById',
    path: '/articles/:id',
    component: ArticleById,
    props: true,
    meta: { requiresAuth: true }
}, {
    name: 'adminPage',
    path: '/admin',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true }
}, {
    name: 'auth',
    path: '/auth',
    component: Auth,
    meta: { auth: true }
}]

const router = new VueRouter({ 
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    const json = localStorage.getItem('__knowledge_user')
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if(to.matched.some(record => record.meta.requiresAdmin)) {
            const user = JSON.parse(json)
            user.admin ? next() : next({ path: '/' })
        } else {
            json == null ? next({ path: '/auth' }) : next()
        }
    } else if(to.matched.some(record => record.meta.auth)) {
        json == null ? next() : next({ path: '/' })
    } else {
        next() 
    }
})

export default router