<template>
  <div class="main_container">
    <h2>Youtube Uploader - Experimental</h2>

    <button v-if="!isAuthenticated" class="login_button" @click="loginWithGoogle">Login with Google</button>

    <div v-else class="file_upload_container">
      <div class="uploader">
        <div>
          <input type="file" multiple accept="video/*" @change="onFileSelect" />
          <button @click="uploadToYoutube" v-if="filesSelected.length > 0">Upload {{ filesSelected.length }} Files</button>
        </div>
        <div class="upload_list_container">
          <div v-for="(item, index) in filesSelected" :key="index" class="upload_list_item">
            {{ item.name }}
          </div>
        </div>
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
    onFileSelect (event) {
      this.uploadQueue = event.target.files

      this.uploadQueue.forEach(file => {
        this.filesSelected.push({ 
          name: file.name,
          size: file.size,
          type: file.type 
        })
      })
    },
    async uploadToYoutube () {
      this.uploadQueue.forEach(file => {
        this.upload(file)
      })
    },
    async upload(file) {
      console.log(file)
      const response = await this.$google.api.client.request({
        path: 'youtube/v3/videos',
        method: 'POST',
        params: {
          part: 'id,snippet,status',
          notifySubscribers: false
        },
        body: {
          snippet: {
            title: 'test video',
            categoryId: this.uploadSettings.category
          },
          status: {
            privacyStatus: this.uploadSettings.privacy,
            selfDeclaredMadeForKids: false
          }
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
  flex-direction: column;
  margin-bottom: 50px;
}
.upload_list_container {
  margin-top: 20px;
}
</style>
