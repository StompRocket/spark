import Vue from 'vue'
import Router from 'vue-router'
import app from '@/components/app'
import chat from '@/components/chat'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'app',
    component: app,
    params: {
      id: null
    }
  },
  {
    path: '/c/:id',
    component: app,
    name: 'chat'
  }

  ]
})
