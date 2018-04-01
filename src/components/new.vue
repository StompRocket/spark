<template>
<div class="new page">
  <nav>
    <router-link class="backBtn" to="/c/">cancel</router-link>
    <h1 class="menuTitle">Spark</h1>
  </nav>

  <div v-if="options" class="options">
    <button @click="createNew">Create New</button>
    <p>or</p>
    <button @click="inviteCode">Enter Invite Code</button>
  </div>


  <div v-if="createNewView" class="createNew">
    <form @submit.prevent="create" class="newChatNameForm">
      <h2>Name your chat</h2>
      <input v-model="newChatName" type="text" name="newChatName" value="" placeholder="Graphite Writer developer chat">
      <p class="error">{{error}}</p>
    </form>
    <button @click="create">Create</button>
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
      options: false,
      createNewView: true,
      newChatName: '',
      error: 'must be less than 15 characters'
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
    inviteCode() {
      this.options = false
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
