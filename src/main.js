import Vue from 'vue'
import App from './App.vue'

import Gapi from 'vue-googleapis'
const SCOPES = 'profile email https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube'
const gauthOption = {
  clientId: `${process.env.VUE_APP_GOOGLE_CLIENT_ID}`,
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
  scope: SCOPES,
  prompt: 'select_account'
}
Vue.use(Gapi, gauthOption)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
