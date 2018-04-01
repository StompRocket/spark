<template>
<div class="app page">

  <nav>
    <button @click="openMenu" class="toggle-button"><i class="material-icons">arrow_back</i></button>
    <h1>Spark</h1>
    <h2>{{chatTitle}}</h2>
    <button @click="openSettings" class="toggle-button"><i class="material-icons">settings</i></button>
  </nav>

  <div id="messages" class="messages">
    <h1 v-if="loading">Loading</h1>
    <div v-for="message in messages" class="message">
      <div v-bind:class="{ mine: isMine(message) }" class="text">
        <p class="messageText" v-html="richTextParse(message.text)"></p>

      </div>
      <p v-if="!isMine(message)" class="messageSender">{{message.sender.name}} {{time(message)}}</p>

    </div>
  </div>
  <form v-if="messages" class="newMessage" @submit.prevent="send">
    <input autocomplete="off" type="text" name="newMessage" placeholder="Type your message here then press enter to send" v-model="newMessage">
  </form>


</div>
</template>

<script>
import firebase from 'firebase'
const linkify = require('linkifyjs');
const linkifyHtml = require('linkifyjs/html');
const moment = require('moment')

import '../assets/app.scss'

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

  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        let name, email, photoUrl, uid, emailVerified;
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;

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
    openMenu() {
      this.$router.replace('/c/')
    },
    openSettings() {
      this.$router.push('/s/' + this.$route.params.id)
    },

    isMine(message) {
      //  console.log(message);
      let user = firebase.auth().currentUser;
      let uid = user.uid;
      let name = user.displayName;
      if (message.sender.uid) {
        if (message.sender.uid === uid) {
          //console.log(message.sender.uid, uid);
          return true
        } else {
          return false
        }
      } else {
        return false
      }

    },
    loadChat(id = this.$route.params.id) {
      console.log('loading ' + id);
      let user = firebase.auth().currentUser;
      let uid = user.uid;
      let name = user.displayName;

      this.loading = true
      this.messages = []
      let objDiv = document.getElementById("messages");
      firebase.database().ref('chats/' + id).once('value', (snapshot) => {
        if (snapshot.val()) {
          this.chatTitle = snapshot.val().title
          firebase.database().ref('users/' + uid + '/' + id).set({
            title: snapshot.val().title,
            id: id
          })
          this.messages = snapshot.val().mesages
          //  console.log('first ' + moment().format('h:mm:ss a'));
          objDiv.scrollTop = objDiv.scrollHeight;
          this.scrollBottom()
          this.loading = false

          let chatRef = firebase.database().ref('chats/' + id + '/mesages/').limitToLast(100);
          chatRef.on('value', (data) => {
            //console.log('second ' + moment().format('h:mm:ss a'));
            this.messages = data.val()
            objDiv.scrollTop = objDiv.scrollHeight;
            this.scrollBottom()



          })


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
          time: Date.now(),
          uid: uid
        },
        text: this.newMessage
      });
      this.newMessage = ''

    },
    time(message) {
      let time = message.sender.time
      if (time) {
        let format = moment(time).format("dddd, MMMM Do, h:mm")
        //console.log(time, format);
        if (format && format != 'Invalid date') {

          //  console.log('there is time');

          return format
        } else {
          return ''
        }
      } else {
        return ''
      }

    }

  }
}
</script>
