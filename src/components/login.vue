<template >
<div class="login page">
  <nav>
    <h1 class="menuTitle">Spark</h1>
  </nav>
  <main>
    <h2>Login</h2>
    <div class="loginButtons">
      <button @click="login">Login With Google</button>
    </div>

  </main>


</div>
</template>

<script>
import '../assets/login.scss'
const firebase = require("firebase");
const provider = new firebase.auth.GoogleAuthProvider();
export default {
  name: 'login',
  props: ['redirect'],
  created() {
    console.log(localStorage.getItem("redirect") + ' params');
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('loggedIn');
        // User is signed in.
        if (localStorage.getItem("redirect")) {
          this.$router.push(localStorage.getItem("redirect"))
          localStorage.removeItem("redirect", null)
        } else {
          this.$router.push('/c/')
        }
      }
    });
  },
  methods: {
    login() {
      firebase.auth().signInWithRedirect(provider);
    }
  }
}
</script>
