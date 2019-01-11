import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/main.scss'

Vue.use(ElementUI)

Vue.config.productionTip = false

var routeList = [];
router.beforeEach((to, from, next) => {
  var index = -1;
  for (var i = 0; i < routeList.length; i++) {
    if (routeList[i].name == to.name) {
      index = i;
      break;
    }
  }
  if (index !== -1) {
    //如果存在路由列表，则把之后的路由都删掉
    routeList.splice(index + 1, routeList.length - index - 1);
  } else if (to.name != '登录') {
    routeList.push({
      "name": to.name,
      "path": to.fullPath,
      'title': to.meta.title
    });
  }
  to.meta.routeList = routeList;
  next()
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')