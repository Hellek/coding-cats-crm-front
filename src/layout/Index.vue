<template>
	<div class="min-h-100vh d-flex">
		<LayoutAuthForm v-if="!isAuthorized"/>

		<div
			v-else
			v-loading="isAuthorizing"
			class="d-flex flex-column flex-grow"
		>
			<template v-if="isGettingNewToken || !isAuthorizing">
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
			isGettingNewToken: state => state.auth.isGettingNewToken,
			tokenRefresherIntervalId: state => state.auth.tokenRefresherIntervalId,
		}),
	},
	async created() {
		try {
			this.$store.dispatch('auth/setAuthHeader')
			this.$store.dispatch('auth/setHttpHooks')
			if (this.isAuthorized) this.$store.dispatch('auth/runTokenRefresher')
		} catch (error) {
			this.$notifyUserAboutError(error)
		}
	},
}
</script>