<template>
  <div class="main_container">
    <div class="navbar">
      <h2>Youtube Uploader - Experimental</h2>
      <button v-if="isAuthenticated" class="logout_button" @click="logout">Logout</button>
    </div>

    <button v-if="!isAuthenticated" class="login_button" @click="loginWithGoogle">Login with Google</button>

    <div v-else class="file_upload_container">
      <file-uploader />
    </div>
  </div>
</template>

<script>
import FileUploader from './components/FileUploader.vue'

export default {
  name: 'App',
  components: {
    FileUploader
  },
  data () {
    return {
      isAuthenticated: false,
      filesSelected: [],
      uploadQueue: null,
      gAccess_token: null,
      uploadSettings: {
        privacy:'unlisted',
        category: '27'
      }
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
        const googleUser = await this.$google.api.auth2.getAuthInstance().signIn()
        if (!googleUser) {
          return null
        }

        this.isAuthenticated = this.$google.api.auth2.getAuthInstance().isSignedIn.get()

        const authResponse = googleUser.getAuthResponse()
        localStorage.setItem('gAccessToken', authResponse.access_token)

      } catch (error) {
        console.warn(error)
      }
    },
    async logout () {      
      try {
        await this.$google.api.auth2.getAuthInstance().signOut()
        localStorage.removeItem('gAccessToken')
        this.isAuthenticated = false
      } catch (error) {
        console.warn(error)
      } 
    },
    async uploadToYoutube () {
      this.uploadQueue.forEach(file => {
        this.upload(file)
      })
    },
    async upload(file) {
      console.log(file)

      const response = await this.$google.api.client.youtube.videos.insert({
        part: "id,snippet,status",
        notifySubscribers: false,
        requestBody: {
          snippet: {
            title: 'test video 1',
            description: "",
            categoryId: this.uploadSettings.category
          },
          status: {
            privacyStatus: this.uploadSettings.privacy,
            selfDeclaredMadeForKids: false
          },
        },
        media: {
          body: file,
        }
      })

      console.log(response)
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
.navbar {
  display: flex;
  align-items: center;
  margin-bottom: 50px;
}
.logout_button {
  margin-left: 20px;
  height: 30px;
  width: 80px;
}
.login_button,
.upload_button {
  width: 300px;
  height: 50px;
}
.file_upload_container {
  flex-direction: column;
  min-width: 50%;
}
.file_upload_container > div {
  text-align: center;
}
.uploader {
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
}
.upload_list_container {
  margin-top: 20px;
}
</style>
