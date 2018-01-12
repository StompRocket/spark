<template>
  <div id="app">
    <h1>app</h1>
</div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to spark'
    }
  },
  methods: {
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
