import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import user from '../components/user/users'
import right from '../components/power/rights.vue'
import role from '../components/power/roles.vue'
import cate from '../components/goods/cate.vue'
import params from '../components/goods/params.vue'
import goodslist from '../components/goods/list.vue'
import add from '../components/goods/add.vue'
import order from '../components/order/order.vue'
import report from '../components/report/report.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: user },
      { path: '/rights', component: right },
      { path: '/roles', component: role },
      { path: '/categories', component: cate },
      { path: '/params', component: params },
      { path: '/goods', component: goodslist },
      { path: '/add', component: add },
      { path: '/orders', component: order },
      { path: '/reports', component: report }
    ]
  }
]

const router = new VueRouter({
  routes
})

/*
  挂载路由导航守卫
  to表示要访问路径
  from表示跳转来的路径
  next放行 next()或者next('path')强制跳转
*/
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') return next()
//   const token = sessionStorage.getItem('token')
//   if (!token) return next('/login')
//   return next()
// })

export default router
