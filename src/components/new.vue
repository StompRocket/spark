<template>
<div class="new page">
  <nav>
    <router-link class="backBtn" to="/c/">cancel</router-link>
    <h1 class="menuTitle">Spark</h1>
  </nav>
  <main>
    <button>Create New</button>
    <p>or</p>
    <button>Enter Invite Code</button>
  </main>



</div>
</template>

<script>
import firebase from 'firebase'
const linkify = require('linkifyjs');
const linkifyHtml = require('linkifyjs/html');
const moment = require('moment')

import '../assets/new.scss'
export default {
  name: 'newChat',
  data() {
    return {
      chats: []
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        let name, email, photoUrl, uid, emailVerified;
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;
        //  console.log(name, uid);
        firebase.database().ref('/users/' + uid).on('value', (snapshot) => {
          for (const value of Object.values(snapshot.val())) {
            if (value.id) {
              this.chats.push(value)
            }
          }
          this.loading = false
        });
      } else {
        this.$router.replace('/')
      }
    });
  }

}
</script>
