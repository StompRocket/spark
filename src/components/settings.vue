<template>
<div class="settings page">
  <nav>
    <button class="toggle-button" @click="back"><i class="material-icons">arrow_back</i></button>
    <h1 class="">Spark</h1>
    <h2>{{chatTitle}}</h2>
  </nav>
  <h1 v-if="loading">Loading</h1>
  <main v-if="!loading">
    <h1>Settings</h1>
    <form @submit.prevent='rename' class="settingsRow">
      <p class="desc">Chat Name <span>{{titleError}}</span></p>
      <input autocomplete="off" v-model="chatTitleEdited" class="settingsInput" type="text" name="chatName" placeholder="chat name">
      <button class="saveBtn" type="button" name="saveName">Save</button>
    </form>
    <button @click="deleteChat" type="button" name="delete" class="deleteBtn">Delete</button>

  </main>



</div>
</template>

<script>
import firebase from 'firebase'
import swal from 'sweetalert';
const linkify = require('linkifyjs');
const linkifyHtml = require('linkifyjs/html');
const moment = require('moment')

import '../assets/settings.scss'
export default {
  name: 'settings',
  data() {
    return {
      chatTitle: '',
      chatTitleEdited: '',
      titleError: '',
      loading: true,
      notifications: ''
    }
  },
  created() {
    console.log('settings ui');
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        let name, email, photoUrl, uid, emailVerified;
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;
        //  console.log(name, uid);

        if (this.$route.params.id) {
          let id = this.$route.params.id
          firebase.database().ref('chats/' + id).on('value', (snapshot) => {
            if (snapshot.val()) {
              this.chatTitle = snapshot.val().title
              this.chatTitleEdited = snapshot.val().title
              this.loading = false
            } else {
              this.$router.replace('/c/')
            }
          })

        } else {
          this.$router.replace('/c/')
        }
      } else {
        this.$router.replace('/')
      }
    });
  },
  methods: {
    back() {
      this.$router.push('/c/' + this.$route.params.id)
    },

    rename() {
      let name = this.chatTitleEdited
      let user = firebase.auth().currentUser
      let uid = user.uid
      let id = this.$route.params.id
      if (name) {
        if (name.length <= 35) {
          if (!/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(name)) {
            console.log('approved');
            this.titleError = ""
            let updates = {}
            updates['/chats/' + id + '/title/'] = name;
            firebase.database().ref().update(updates);
          } else {
            this.titleError = "can not contain special characters"
          }
        } else {
          this.titleError = 'chat name must be less than 30 characters'
        }
      } else {
        this.titleError = 'chat name is required'
      }
    },
    deleteChat() {
      swal({
          title: "Are you sure?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            let name = this.chatTitleEdited
            let user = firebase.auth().currentUser
            let uid = user.uid
            let id = this.$route.params.id
            console.log('deleteing');
            firebase.database().ref('users' + '/' + uid + '/' + id).remove()

            this.$router.replace('/c/')
          }
        });
    }
  }
}
</script>
