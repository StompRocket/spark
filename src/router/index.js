import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/login'
import firebase from 'firebase'
import app from '@/components/app'
import welcome from '@/components/welcome'
Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/a/',
      name: 'app',
      component: app,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'welcome',
          component: welcome
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('/a/welcome')
  else next()
})
export default router
