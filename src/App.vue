<template>
  <div class="main_container">
    <h2>Youtube Uploader - Experimental</h2>

    <button v-if="!isAuthenticated" class="login_button" @click="loginWithGoogle">Login with Google</button>

    <div v-else class="file_upload_container">
      File upload container here
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {

  },
  data () {
    return {
      isAuthenticated: false
    }
  },
  methods: {
    async loginWithGoogle () {
      try {
        const googleUser = await this.$gAuth.signIn()
        if (!googleUser) {
          return null
        }

        this.isAuthenticated = this.$gAuth.isAuthorized

        const authResponse = googleUser.getAuthResponse()

        console.log(authResponse)

      } catch (error) {
        return null
      }
    }
  }
}
</script>

<style>
.main_container {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.login_button {
  width: 300px;
  height: 50px;
}
</style>
