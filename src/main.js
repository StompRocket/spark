// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'
let app = null
Vue.config.productionTip = false
var config = {
  apiKey: 'AIzaSyC33Gp6-aRbajLAp22adwWJdIvXX4CVHcM',
  authDomain: 'spark-524b4.firebaseapp.com',
  databaseURL: 'https://spark-524b4.firebaseio.com',
  projectId: 'spark-524b4',
  storageBucket: 'spark-524b4.appspot.com',
  messagingSenderId: '1043381207552'
}
firebase.initializeApp(config)

/* eslint-disable no-new */
firebase.auth().onAuthStateChanged(function (user) {
  console.log('auth changed')
  if (!app) {
    console.log('app init')
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      template: '<App/>',
      components: { App },
      router
    })
  }
})
