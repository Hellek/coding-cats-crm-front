<template>
	<div class="min-h-100vh d-flex">
		<LayoutAuthForm v-if="!isAuthorized"/>

		<div
			v-else
			v-loading="isAuthorizing"
			class="d-flex flex-column flex-grow"
		>
			<template v-if="!isAuthorizing">
				<LayoutHeader/>
				<LayoutMain/>
			</template>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'Layout',
	components: {
		LayoutAuthForm: () => import('./LayoutAuthForm'),
		LayoutHeader: () => import('./LayoutHeader'),
		LayoutMain: () => import('./LayoutMain'),
	},
	computed: {
		...mapState({
			isAuthorized: state => state.auth.isAuthorized,
			isAuthorizing: state => state.auth.isAuthorizing,
		}),
	},
	async created() {
		try {
			this.$store.dispatch('auth/setHttpHooks')
			this.$store.dispatch('auth/ping')
		} catch (error) {
			this.$notifyUserAboutError(error)
		}
	},
}
</script>