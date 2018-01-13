<template>
  <div id="app">
    <ul id="slide-out" class="sidenav sidenav-fixed">
      <li><a href="#!">First Sidebar Link</a></li>
      <li><a href="#!">Second Sidebar Link</a></li>
    </ul>
    <a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">menu</i></a>
      <router-view></router-view>
</div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to spark'
    }
  },
  methods: {
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })

    }
  }
}
var elem = document.querySelector('.sidenav');
let options = {
  draggable: true
}
var instance = M.Sidenav.init(elem, options);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.appCompoenent {
    padding-left: 300px;
  }

  @media only screen and (max-width : 992px) {
    .appCompoenent {
      padding-left: 0;
    }
  }
</style>
