<template>
<div class="new page">
  <nav>
    <router-link class="backBtn" to="/c/">cancel</router-link>
    <h1 class="menuTitle">Spark</h1>
  </nav>

  <div v-if="options" class="options">
    <button @click="createNew">Create New</button>
    <p>or</p>
    <button @click="openInviteCode">Enter Invite Code</button>
  </div>


  <div v-if="createNewView" class="createNew">
    <form @submit.prevent="create" class="newChatNameForm">
      <h2>Name your chat</h2>
      <input v-model="newChatName" type="text" name="newChatName" value="" placeholder="Graphite Writer developer chat">
      <p class="error">{{error}}</p>
    </form>
    <button @click="create">Create</button>
  </div>

  <div v-if="invite" class="createNew">
    <form @submit.prevent="fromInvite" class="newChatNameForm">
      <h2>Please enter the chat invite code</h2>
      <input v-model="inviteCode" type="text" name="joinCode" value="" placeholder="e05GxPK">
      <p class="error">{{inviteError}}</p>
    </form>
    <button @click="fromInvite">Join</button>
  </div>


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
      options: true,
      createNewView: false,
      inviteCode: '',
      invite: false,
      newChatName: '',
      error: 'must be less than 15 characters',
      inviteError: ''
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
      } else {
        this.$router.replace('/')
      }
    });
  },
  methods: {
    createNew() {
      this.options = false
      this.createNewView = true;
    },
    openInviteCode() {
      this.options = false
      this.invite = true
    },
    fromInvite() {

      let user = firebase.auth().currentUser
      let uid = user.uid
      if (this.inviteCode) {
        firebase.database().ref('/codeRef/' + this.inviteCode).once('value').then((snapshot) => {
          if (snapshot.val()) {
            console.log(snapshot.val());
            this.inviteError = "success!"
            this.$router.push('/c/' + snapshot.val().id)

          } else {
            this.inviteError = "code invalid"
          }
        });
      } else {
        this.inviteError = "join code required"
      }
    },
    create() {
      let name = this.newChatName
      let user = firebase.auth().currentUser
      let uid = user.uid
      if (name) {
        if (name.length <= 35) {
          if (!/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(name)) {
            let newChatRef = firebase.database().ref('chats/').push()
            let key = newChatRef.key
            let time = Date.now()
            newChatRef.set({
              title: name,
              id: key,
              mesages: {
                '-KuvTy9nUfCdKGkPsMrs': {
                  text: 'A new spark team',
                  sender: {
                    name: 'admin',
                    image: 'spark',
                    uid: 'spark',
                    time: time
                  }
                }
              },
              meta: {
                members: {
                  [uid]: {
                    name: name,
                    uid: uid
                  }
                },
                time: time,
                image: 'spark'

              }

            }).then((snap) => {

              this.$router.push('/c/' + key)
            })
          } else {
            this.error = "can not contain special characters"
          }
        } else {
          this.error = 'chat name must be less than 30 characters'
        }
      } else {
        this.error = 'chat name is required'
      }
    }
  }

}
</script>
