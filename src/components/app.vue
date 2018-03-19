<template>
<div class="app page">
  <div class="chatNav card">
    <div class="menu">

      <button type="button" name="button" class="vcenter btn-flat white-text red inviteBtn">Invite</button>
      <button type="button" name="button" class="vcenter btn-flat  inviteBtn"> <i class="material-icons red-text">add</i></button>
    </div>
    <div class="chats">

      <router-link v-for="chat in chats" :to="'/c/'+chat.id" :key="chat.id" class="chatItem">
        <p class="name">{{chat.title}}</p>
        <p class="members">Members</p>
      </router-link>
    </div>

  </div>
  <router-view></router-view>
</div>
</template>
<script>
import firebase from 'firebase'
import '@/assets/app.scss'
//import chat from '@/components/chat.vue'
const db = firebase.database()
var user = firebase.auth().currentUser;
var name, email, photoUrl, uid, emailVerified;

export default {
  name: "app",
  data() {
    return {
      chats: [],
      chatID: this.$route.params.id
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;

        db.ref('/users/' + uid).on('value', (snapshot) => {
          for (const value of Object.values(snapshot.val())) {
            if (value.id) {
              this.chats.push(value)
            }
          }
        });
      } else {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // ...
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
        // No user is signed in.
      }
    });

  }
}
</script>
