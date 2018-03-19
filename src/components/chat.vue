<template>
<div id="chat">
  <div class="messages">
    <div v-for="message in messages" class="message">
      <!--<img :src="message.sender.image" class="circle" alt="">
      <div class="text">
        <p class="messageText">{{message.text}}</p>
        <p class="messageSender">{{message.sender.name}}</p>
      </div>
-->
      {{message.sender}}

    </div>
  </div>
  <form class="newMessage">
    <input type="text" name="newMessage" placeholder="Type your message here then press enter to send">
  </form>
</div>
</template>
<script>
import '@/assets/chat.scss'
import firebase from 'firebase'
var db = firebase.database()
export default {
  name: "chat",
  props: ['chatID', 'id'],
  data() {
    return {
      messages: []
    }
  },
  firebase() {
    return {
      FBmessages: {
        source: db.ref('chats/' + this.$route.params.id + '/mesages'),
        // optionally bind as an object
        asObject: true,
        // optionally provide the cancelCallback
        cancelCallback: function() {
          console.log('cancled');
        },
        // this is called once the data has been retrieved from firebase
        readyCallback: () => {
          console.log('ready');
          this.messages = this.FBmessages
        }
      }

    }

  },
  created() {
    //do something after updating vue instance
    console.log('created');
  }
}
</script>
