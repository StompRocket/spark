<template>
<div id="chat">
  <div class="messages">
    <div class="message">
      <img src="@/assets/profile.png" class="circle" alt="">
      <div class="text">
        <p class="messageText">Message</p>
        <p class="messageSender">name</p>
      </div>

    </div>
  </div>
  <form class="newMessage">
    <input type="text" name="newMessage" placeholder="Type your message here then press enter to send">
  </form>
</div>
</template>
<script>
import '@/assets/chat.scss'
export default {
  name: "chat",
  data: () => ({

  })
}
</script>
