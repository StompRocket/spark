<template>
<div class="app page">
  <Slideout id="Slideout" menu="#menu" panel="#panel" @on-open="open" :toggleSelectors="['.toggle-button']">
    <nav id="menu">
      <h2>Chats</h2>
      <div class="chats">

        <div v-for="chat in chats" :key="chat.id" class="chatItem">
          <a :href="'/#/c/'+chat.id" @click="loadChat(chat.id)">
            <p class="name">{{chat.title}}</p>
          </a>
        </div>
      </div>
    </nav>
    <main id="panel">

      <nav>
        <button class="toggle-button"><i class="material-icons">menu</i></button>
        <h1>Spark</h1>
        <h2>{{chatTitle}}</h2>
      </nav>

      <div @click="closeSlider" id="messages" class="messages">
        <div v-for="message in messages" class="message">
          <div v-bind:class="{ mine: isMine(message) }" class="text">
            <p class="messageText" v-html="richTextParse(message.text)"></p>

          </div>
          <p v-if="!isMine(message)" class="messageSender">{{message.sender.name}}</p>

        </div>
      </div>
      <form @click="closeSlider" class="newMessage" @submit.prevent="send">
        <input autocomplete="off" type="text" name="newMessage" placeholder="Type your message here then press enter to send" v-model="newMessage">
      </form>
    </main>
  </Slideout>
</div>
</template>

<script>
import firebase from 'firebase'
const linkify = require('linkifyjs');
const linkifyHtml = require('linkifyjs/html');
const moment = require('moment')

import '../assets/app.scss'
import Slideout from 'vue-slideout'
export default {
  name: 'app',
  data() {
    return {
      chats: [],
      chatID: this.$route.params.id,
      messages: [],
      newMessage: '',
      loading: true,
      chatTitle: null
    }
  },
  components: {
    Slideout
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
        console.log(name, uid);
        firebase.database().ref('/users/' + uid).on('value', (snapshot) => {
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
        this.$router.replace('/')
      }
    });
  },

  methods: {
    isMine(message) {
      console.log(message);
      let user = firebase.auth().currentUser;
      let uid = user.uid;
      let name = user.displayName;
      if (message.sender.uid) {
        if (message.sender.uid === uid) {
          console.log(message.sender.uid, uid);
          return true
        } else {
          return false
        }
      } else {
        return false
      }

    },
    open: function() {
      console.log('slideoutOpen')
    },
    closeSlider() {
      this.$children[0].slideout.close();
    },
    loadChat(id = this.$route.params.id) {
      console.log('loading ' + id);
      let user = firebase.auth().currentUser;
      let uid = user.uid;
      let name = user.displayName;
      this.$children[0].slideout.close();
      this.loading = true
      this.messages = []
      let objDiv = document.getElementById("messages");
      firebase.database().ref('chats/' + id).on('value', (snapshot) => {
        if (snapshot.val()) {
          this.chatTitle = snapshot.val().title
          firebase.database().ref('users/' + uid + '/' + id).set({
            title: snapshot.val().title,
            id: id
          })
          let chatRef = firebase.database().ref('chats/' + id + '/mesages/');
          chatRef.on('child_added', (data) => {
            this.messages.push(data.val())
            objDiv.scrollTop = objDiv.scrollHeight;
            this.scrollBottom()
            this.loading = false
          });


        } else {
          this.$router.replace('/c/')
        }

      })




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

  }
}
</script>
