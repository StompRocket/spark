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
      children: [
        // UserHome will be rendered inside User's <router-view>
        // when /user/:id is matched
        {
          path: 'c/:id',
          component: chat,
          name: 'chat'
        }


      ]
    }

  ]
})