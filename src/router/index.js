import Vue from 'vue'
import VueRouter from 'vue-router'
import Reg from '../views/Reg.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    component: Reg
  },
  {
    path:'/login',
    component:() =>import("../views/Login.vue")
  },
  {
    path: '/list',
    component: () => import('../views/List.vue')
  },
  ,
  {
    path:"/shop/shopName",
    component:() =>import("../views/ShopName.vue")
  },
  {
    path: "/shop/descibe",
    component: () => import('../views/Describe.vue')
  },
  ,
  {
    path:"/food/createFood",
    component:() =>import("../views/CreatedFood.vue")
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
