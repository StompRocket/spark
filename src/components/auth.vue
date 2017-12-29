<template>
<div id="auth">
  {{msg}}
</div>
</template>

<script>
export default {
  name: 'auth',
  data() {
    return {
      msg: this.$route.params.redirect
    }
  },
  created: function() {
    if (this.$store.getters.getUser) {
      this.$store.dispatch('userLogOut', {})
    } else {
      this.$store.dispatch('userSignIn', {})
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
