<template>
  <div id="login" class="container">
    <h1>Spark</h1>
  <h2>Sign In</h2>
  <button v-on:click="login" id="signIn" class="waves-effect waves-light btn-large">Login With Google</button>

  </div>
</template>

<script>
import firebase from 'firebase'
var provider = new firebase.auth.GoogleAuthProvider()
export default {
  name: 'login',
  date: function () {
    return {}
  },
  methods: {
    login: function() {
      firebase.auth().signInWithPopup(provider).then((result) => {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
  this.$router.replace('/a/welcome')
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});

    }
  }
}
</script>

<style scoped>
#app {

}
h1  {
text-align: center;
font-weight: bold;
font-size: 6vw;
}
h2 {
  text-align: center;
  font-weight: 400;
}
#signIn {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>
