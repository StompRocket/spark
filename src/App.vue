<template>
<div id="app">
  <router-view></router-view>
</div>
</template>

<script>
import '../node_modules/minireset.css/minireset.min.css'
import './assets/global.scss'
const firebase = require("firebase");;
export default {
  name: 'app'
}
</script>
