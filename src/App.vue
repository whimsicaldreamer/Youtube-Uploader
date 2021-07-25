<template>
  <div class="main_container">
    <h2>Youtube Uploader - Experimental</h2>

    <button v-if="!isAuthenticated" class="login_button" @click="loginWithGoogle">Login with Google</button>

    <div v-else class="file_upload_container">
      <div class="uploader">
        <input type="file" multiple accept="video/*" @change="onFileSelect" />
        <button v-if="filesSelected.length > 0">Upload {{ filesSelected.length }} Files</button>
      </div>

      <button v-if="isAuthenticated" class="logout_button" @click="logout">Logout</button>
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
      isAuthenticated: false,
      filesSelected: [],
      gAccess_token: null
    }
  },
  created () {
    this.gAccess_token = localStorage.getItem('gAccessToken')

    if (this.gAccess_token) {
      this.isAuthenticated = true
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
        localStorage.setItem('gAccessToken', authResponse.access_token)

      } catch (error) {
        return null
      }
    },
    async logout () {
      const response = await this.$gAuth.signOut()
      if (response) {
        localStorage.removeItem('gAccessToken')
        this.isAuthenticated = false
      }
    },
    onFileSelect (event) {
      event.target.files.forEach(file => {
        this.filesSelected.push({ 
          name: file.name,
          size: file.size,
          type: file.type 
        })
      })
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
.login_button,
.logout_button {
  width: 300px;
  height: 50px;
}
.file_upload_container {
  flex-direction: column;
}
.uploader {
  display: flex;
  margin-bottom: 50px;
}
</style>
