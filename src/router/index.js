import Vue from 'vue'
import Router from 'vue-router'
import app from '@/components/app'
import login from '@/components/login'
import menu from '@/components/menu'
import settings from '@/components/settings'
import newChat from '@/components/new'
import firebase from 'firebase'
Vue.use(Router)

let router = new Router({
  routes: [{
    path: '/',
    name: 'Login',
    component: login
  },
    {
      path: '/c/',
      name: 'menu',
      component: menu,
      meta: {
        requiresAuth: true
      },
      params: {
        id: false
      }
    },
    {
      path: '/new/',
      name: 'newChat',
      component: newChat,
      meta: {
        requiresAuth: true
      },
      params: {
        id: false
      }
    },
    {
      path: '/c/:id',
      name: 'app',
      component: app,
      meta: {
        requiresAuth: true
      },
      params: {
        id: false
      }
    },
    {
      path: '/s/:id',
      name: 'settings',
      component: settings,
      meta: {
        requiresAuth: true
      },
      params: {
        id: false
      }
    },
    {
      path: '/s/',
      name: 'settingsRedirect',
      component: settings,
      meta: {
        requiresAuth: true
      },
      params: {
        id: false
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser
  // console.log(`requiresAuth: ${requiresAuth} user: ${currentUser}`);
  if (requiresAuth && !currentUser) {
    next('/')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
})
export default router
