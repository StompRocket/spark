<template>
<div id="chat">
  <div class="message row">
    <div class="col s2">
      <img>
    </div>
    <div class="col s10">
      <p class="content">message.content</p>
      <p class="sender">message.sender message.time</p>
    </div>

  </div>
</div>
</template>

<script>
export default {
  name: 'chat',
  data() {
    return {
      msg: this.$route.params.id
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  text-align: center;
  font-weight: bold;
}

.content {
  font-weight: bold;
  margin-bottom: 0;
}

.sender {
  margin-top: 0;
  font-weight: 300;
}
</style>
