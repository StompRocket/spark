// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
const firebase = require('firebase')
let vueApp;
const config = {
  apiKey: "AIzaSyC33Gp6-aRbajLAp22adwWJdIvXX4CVHcM",
  authDomain: "spark-524b4.firebaseapp.com",
  databaseURL: "https://spark-524b4.firebaseio.com",
  projectId: "spark-524b4",
  storageBucket: "spark-524b4.appspot.com",
  messagingSenderId: "1043381207552"
};
firebase.initializeApp(config);
Vue.config.productionTip = false

/* eslint-disable no-new */

vueApp = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
