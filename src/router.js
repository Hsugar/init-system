import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {title: '首页'},
      component: Home
    },
    {
      path: '/home',
      name: 'home',
      meta: {title: '首页'},
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      meta: {title: '关于'},
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/record',
      name: 'record',
      meta: {title: '基础档案'},
      component: () => import('./views/record/school.vue'),
      children: [
        {
          path: '/record',
          name: 'record',
          meta: {title: '校区档案'},
          component: () => import('./views/record/school.vue'),
        },
        {
          path: '/record/student',
          name: 'student',
          meta: { title: '学生档案'},
          component: () => import('./views/record/student.vue'),
        },
        {
          path: '/record/teacher',
          name: 'teacher',
          meta: { title: '教师档案'},
          component: () => import('./views/record/teacher.vue'),
        },
       
      ]
    },
    // {
    //   path: '/record/student',
    //   name: 'student',
    //   meta: { title: '学生档案'},
    //   component: () => import('./views/record/student.vue'),
    // },
  ]
})
