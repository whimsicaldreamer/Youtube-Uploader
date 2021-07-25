import Vue from 'vue'
import App from './App.vue'

import GAuth from 'vue-google-oauth2'
const gauthOption = {
  clientId: `${process.env.VUE_APP_GOOGLE_CLIENT_ID}`,
  scope: 'profile email',
  prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
