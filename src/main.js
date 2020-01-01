import Vue from 'vue'
import ElementUi from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ru-RU'
import router from 'Plugins/router'
import store from 'Plugins/store'
import $dayjs from 'KitPlugins/dayjs'
import $http from 'KitPlugins/http'
// import metrika from 'KitPlugins/vue-yandex-metrika'
import Styles from 'Styles/index.scss'
// import KitComponents from 'KitComponents/common'
import KitPlugins from 'KitPlugins/common'
import App from './layout/Index.vue'

// common
Vue.use($dayjs)
Vue.use($http)
// Vue.use(KitComponents)
Vue.use(Styles)
Vue.use(ElementUi, { locale, size: 'small' })
Vue.use(KitPlugins)

Vue.config.productionTip = false

new Vue({
	router,
	store,
	// metrika,
	render: h => h(App),
}).$mount('#app')