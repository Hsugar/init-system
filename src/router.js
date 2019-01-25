import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)
export default new Router({
  routes: [{
      path: '/',
      name: 'home',
      meta: {
        title: '系统设置'
      },
      component: Home
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        title: '系统设置'
      },
      component: Home
    },
    {
      path: '/record',
      name: 'school',
      meta: {
        title: '基础档案'
      },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( /* webpackChunkName: "about" */ './views/record/school/index.vue'),
      redirect: '/record/school'
    },
    {
      path: '/record/school',
      name: 'school',
      meta: {
        title: '学校档案'
      },
      component: () => import('./views/record/school.vue'),
    },
    {
      path: '/record/campus',
      name: 'campus',
      meta: {
        title: '校区档案'
      },
      component: () => import('./views/record/campus.vue'),
    },
    {
      path: '/record/season',
      name: 'season',
      meta: {
        title: '学生档案'
      },
      component: () => import('./views/record/student.vue'),
    },
   
   
   
   
   
  ]
})