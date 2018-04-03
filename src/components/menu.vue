<template>
<div class="menu page">
  <nav>
    <h1 class="menuTitle">Spark</h1>
  </nav>
  <h1 v-if="loading">Loading</h1>
  <main v-if="!loading">
    <form v-if="false" class="searchForm">
      <input type="text" class="searchChats" name="searchChats" value="" placeholder="Search">
    </form>

    <h2>Chats</h2>
    <div class="chats">

      <div v-for="chat in chatsByDate" :key="chat.id" class="chatItem">
        <a :href="'/#/c/'+chat.id">
            <img src="../assets/placeholder.png" alt="">
            <div class="text">
              <p class="name">{{chat.title}}</p>
              <p class="desc">{{chat.time}}</p>
            </div>

          </a>
      </div>
    </div>


    <button @click="newChat" class="newChat" type="button" name="newChat">new chat</button>
  </main>



</div>
</template>

<script>
import firebase from 'firebase'
const linkify = require('linkifyjs');
const linkifyHtml = require('linkifyjs/html');
const moment = require('moment')

import '../assets/menu.scss'
export default {
  name: 'chatMenu',
  data() {
    return {
      chats: [],
      loading: true
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
        console.log(uid);
        //  console.log(name, uid);
        firebase.database().ref('/users/' + uid).on('value', (snapshot) => {
          if (snapshot.val()) {
            for (const value of Object.values(snapshot.val())) {
              if (value.id) {
                value.time = 'a while ago'
                value.utc = Date.now() - 50000000
                let id = value.id
                firebase.database().ref('/chats/' + id).once('value').then((snapshot) => {
                  //console.log(snapshot.val());
                  let format;
                  if (snapshot.val()) {
                    if (snapshot.val().time) {
                      let time = snapshot.val().time
                      value.utc = time
                      format = moment(time).format("dddd, MMMM Do, h:mm")
                      //console.log(time, format);
                      if (format && format != 'Invalid date') {

                      } else {
                        formet = 'a while ago'
                      }
                    } else {
                      format = 'a while ago'
                    }
                    //  console.log('format ' + format);
                    value.time = format
                    this.chats.push(value)
                    this.loading = false
                  }

                })



              }
            }
          } else {
            this.loading = false
          }


        });

      } else {
        this.$router.replace('/')
      }
    });
  },
  computed: {
    chatsByDate: function() {
      return this.chats.sort((a, b) => {
        if (a.utc > b.utc) {
          return -1
        } else if (a.utc < b.utc) {
          return 1
        } else {
          return 0
        }
      })
    }
  },
  methods: {

    newChat() {
      this.$router.replace('/new/')
    }
  }

}
</script>
