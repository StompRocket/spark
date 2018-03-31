<template>
<div class="app page">
  <div class="chatNav card">
    <div class="menu">

      <button type="button" name="button" class="vcenter btn-flat white-text red inviteBtn">Invite</button>
      <button type="button" name="button" class="vcenter btn-flat  inviteBtn"> <i class="material-icons red-text">add</i></button>
    </div>
    <div class="chats">

      <div v-for="chat in chats" :key="chat.id" class="chatItem">
        <a :href="'/#/c/'+chat.id" @click="loadChat(chat.id)">
          <p class="name">{{chat.title}}</p>
          <p class="members">Members</p>
        </a>
      </div>
    </div>

  </div>
  <div id="chat">
    <div v-if="loading" class="progress">
      <div class="indeterminate"></div>
    </div>
    <div id="messages" class="messages">
      <div v-for="message in messages" class="message">
        <img :src="message.sender.image" class="circle" alt="">
        <div class="text">
          <p class="messageText" v-html="richTextParse(message.text)"></p>
          <p class="messageSender">{{sender(message.sender)}}</p>
        </div>


      </div>
    </div>
    <form class="newMessage" @submit.prevent="send">
      <input type="text" name="newMessage" placeholder="Type your message here then press enter to send" v-model="newMessage">
    </form>
  </div>
</div>
</template>
<script>
import firebase from 'firebase'
import '@/assets/chat.scss'
import '@/assets/app.scss'
const linkify = require('linkifyjs');
const linkifyHtml = require('linkifyjs/html');
const moment = require('moment')
//import chat from '@/components/chat.vue'
const db = firebase.database()
let user = firebase.auth().currentUser;
let name, email, photoUrl, uid, emailVerified;

export default {
  name: "app",
  data() {
    return {
      chats: [],
      chatID: this.$route.params.id,
      messages: [],
      newMessage: '',
      loading: true
    }
  },
  created() {
    console.log('created');
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
          this.loading = false
        });

        if (this.$route.params.id) {
          this.loadChat()
        }
      } else {
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          let token = result.credential.accessToken;
          // The signed-in user info.
          let user = result.user;
          // ...
        }).catch(function(error) {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          // The email of the user's account used.
          let email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          let credential = error.credential;
          // ...
        });
        // No user is signed in.
      }
    });

  },

  methods: {
    sender(sender) {
      if (sender) {
        //console.log(sender.name);
        return sender.name
      } else {
        return 'error'
      }


    },
    loadChat(id) {
      this.loading = true
      this.messages = []
      let objDiv = document.getElementById("messages");
      if (id) {
        console.log('loading ' + id);

        let chatRef = firebase.database().ref('chats/' + id + '/mesages/');
        chatRef.on('child_added', (data) => {
          this.messages.push(data.val())
          objDiv.scrollTop = objDiv.scrollHeight;
          this.scrollBottom()
          this.loading = false
        });
      } else {
        console.log('loading ' + this.$route.params.id);
        let chatRef = firebase.database().ref('chats/' + this.$route.params.id + '/mesages/');
        chatRef.on('child_added', (data) => {
          this.messages.push(data.val())
          objDiv.scrollTop = objDiv.scrollHeight;
          this.scrollBottom()
          this.loading = false
        });
      }



    },
    scrollBottom() {
      let objDiv = document.getElementById("messages");
      setTimeout(function() {
        objDiv.scrollTop = objDiv.scrollHeight;
      }, 500);
    },
    richTextParse(message) {
      return linkifyHtml(message, {
        defaultProtocol: 'https'
      });

    },
    send() {
      let chatID = this.$route.params.id
      let timeStamp = JSON.stringify(moment().utc())
      let user = firebase.auth().currentUser;
      let newMessageRef = firebase.database().ref('chats/' + chatID + '/mesages/').push();
      let name, email, photoUrl, uid, emailVerified;
      if (user != null) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
      }

      newMessageRef.set({
        sender: {
          name: name,
          image: photoUrl,
          time: timeStamp,
          uid: uid
        },
        text: this.newMessage
      });
      this.newMessage = ''

    }
  },

}
</script>
