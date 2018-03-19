<template>
<div id="app">
  <router-view/>
</div>
</template>

<script>
import firebase from 'firebase'
var config = {
  apiKey: "AIzaSyC33Gp6-aRbajLAp22adwWJdIvXX4CVHcM",
  authDomain: "spark-524b4.firebaseapp.com",
  databaseURL: "https://spark-524b4.firebaseio.com",
  projectId: "spark-524b4",
  storageBucket: "spark-524b4.appspot.com",
  messagingSenderId: "1043381207552"
};
firebase.initializeApp(config);

import '@/assets/global.scss'
import '../node_modules/materialize-css/dist/css/materialize.min.css'
import '../node_modules/materialize-css/dist/js/materialize.min.js'
export default {
  name: 'App'
}
</script>
