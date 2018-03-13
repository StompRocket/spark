<template>
<div class="app page">
  <div class="chatNav card">
    <div class="menu">

      <button type="button" name="button" class="vcenter btn-flat white-text red inviteBtn">Invite</button>
      <button type="button" name="button" class="vcenter btn-flat  inviteBtn"> <i class="material-icons red-text">add</i></button>
    </div>
    <div class="chatItem">
      <p class="name">Name</p>
      <p class="members">Members</p>
    </div>
  </div>
  <chat/>
</div>
</template>
<script>
import '@/assets/app.scss'
import chat from '@/components/chat.vue'
export default {
  name: "app",
  components: {
    chat
  },
  data: () => ({

  })
}
</script>
