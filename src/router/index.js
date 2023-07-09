import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: 'introduce',
    component: () => import(/* webpackChunkName: "about" */ '../views/index.vue'),
    children: [
      {
        path: '/introduce',
        name: 'introduce',
        component: () => import(/* webpackChunkName: "introduce" */ '../views/Introduce')
      },
      {
        path: '/user/code',
        name: 'code',
        component: () => import(/* webpackChunkName: "about" */ '../views/Code.vue')
      },
    ]
  },
  { 
    path: '*',
    redirect: 'introduce'
  }
]

const router = new VueRouter({
  base: '/',
  routes
})

export default router
