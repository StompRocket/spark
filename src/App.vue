<template>
<div id="app">
  <ul id="sideNav" class="side-nav fixed">
    <li><a href="#!">First Sidebar Link</a></li>
    <li><a href="#!">Second Sidebar Link</a></li>
  </ul>
  <a data-activates="sideNav" class="button-collapse"><i class="material-icons">menu</i></a>
  <main>
    <router-view/>
  </main>

</div>
</template>

<script>
export default {
  name: 'app'
}
$(".button-collapse").sideNav();
</script>

<style>
header,
main,
footer {
  padding-left: 300px;
}

@media only screen and (max-width: 992px) {
  header,
  main,
  footer {
    padding-left: 0;
  }
}
</style>
