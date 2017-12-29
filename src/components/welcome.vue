<template>
<div id="welcome" class="container">
  <h1>Welcome To {{appTitle}}</h1>
  <p class="flow-text">Spark is an online messaging platform focused on productivity. Spark has Graphite Writer, Google Docs, and many more intergrations to speed up your workflow.</p>
  <router-link :to="{ name: 'auth', params: { redirect: 'welcome'}}">Login</router-link>
</div>
</template>

<script>
export default {
  name: 'welcome',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  computed: {
    appTitle() {
      return this.$store.getters.appTitle
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
</style>
