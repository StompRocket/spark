<template >
<div class="login page">
  <div class="loginStack">
    <h1>Login</h1>
    <div class="loginButtons">
      <button @click="login">Login With Google</button>
    </div>

  </div>
</div>
</template>

<script>
import '../assets/login.scss'
const firebase = require("firebase");
const provider = new firebase.auth.GoogleAuthProvider();
export default {
  name: 'login',
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('loggedIn');
        // User is signed in.
        this.$router.push('/c/')
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
