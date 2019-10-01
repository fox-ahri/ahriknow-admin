import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store'
import Error404 from './views/404.vue'
import notebook from './routers/notebook'
import ahridata from './routers/ahridata'
import transfer from './routers/transfer'
import blog from './routers/blog'
import setting from './routers/setting'

Vue.use(Router)

const root = [
  {
    path: '/',
    name: 'home',
    alias: '/admin',
    component: Home
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import(/* webpackChunkName: "about" */ './views/Auth.vue'),
    redirect: "/auth/login",
    children: [{
      path: 'login',
      name: 'auth-login',
      component: () => import(/* webpackChunkName: "auth-login" */ './views/auth/Login.vue'),
    }, {
      path: 'register',
      name: 'auth-register',
      component: () => import(/* webpackChunkName: "auth-register" */ './views/auth/Register.vue'),
    }, {
      path: 'verification',
      name: 'auth-verification',
      component: () => import(/* webpackChunkName: "auth-verification" */ './views/auth/Verification.vue'),
    }]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
  },
  {
    path: '*',
    name: '404',
    component: Error404
  }
]

function concat() {
  let router = []
  let len = arguments.length;
  for (var i = 0; i < len; i++) {
    arguments[i].forEach(route => {
      router.push(route)
    })
  }
  return router
}

const router = new Router({
  routes: concat(root, notebook, ahridata, transfer, blog, setting)
})

router.beforeEach((to, from, next) => {
  localStorage.setItem("from", from.name);
  let is_login = store.state.user || null;
  if (to.meta.required) {
    if (is_login && is_login.role >= 10) {
      next();
    } else {
      next('/auth/login');
    }
  } else {
    next();
  }
})

export default router;
