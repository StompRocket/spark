import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import welcome from '@/components/welcome'
import chat from '@/components/chat'
import auth from '@/components/auth'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: welcome
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: chat
    },
    { path: '/auth/:redirect',
      name: 'auth',
      component: auth
    }
  ]
})
