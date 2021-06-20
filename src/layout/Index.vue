<template>
	<div class="min-h-100vh d-flex">
		<LayoutAuthForm v-if="!isAuthorized"/>

		<div
			v-else
			v-loading="isAuthorizing || appUtilsLoading"
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
import { syncOperations } from 'Helpers/methods'

export default {
	name: 'Layout',
	components: {
		LayoutAuthForm: () => import('./LayoutAuthForm'),
		LayoutHeader: () => import('./LayoutHeader'),
		LayoutMain: () => import('./LayoutMain'),
	},
	computed: {
		...mapState({
			currentUser: state => state.users.user,
			isOperationsLoading: state => state.tinkoffInvest.isOperationsLoading,
			isAccountsLoading: state => state.tinkoffInvest.isAccountsLoading,
			isAuthorized: state => state.auth.isAuthorized,
			isAuthorizing: state => state.auth.isAuthorizing,
			isGettingNewToken: state => state.auth.isGettingNewToken,
			tokenRefresherIntervalId: state => state.auth.tokenRefresherIntervalId,
		}),
		appUtilsLoading() {
			return this.isOperationsLoading || this.isAccountsLoading
		},
	},
	watch: {
		isAuthorized: {
			handler: 'setAppUtilsLoading',
		},
	},
	async created() {
		try {
			this.$store.dispatch('auth/setAuthHeader')
			this.$store.dispatch('auth/setHttpHooks')
			if (this.isAuthorized) this.$store.dispatch('auth/runTokenRefresher')
			this.setAppUtilsLoading()
		} catch (error) {
			this.$notifyUserAboutError(error)
		}
	},
	methods: {
		syncOperations,
		async setAppUtilsLoading() {
			if (!this.isAuthorized) return
			if (!this.currentUser.TIRealToken && !this.currentUser.TISandboxToken) return

			try {
				await Promise.all([
					this.$store.dispatch('tinkoffInvest/setAllInstuments'),
					this.$store.dispatch('tinkoffInvest/setAccounts'),
				])

				this.syncOperations()
			} catch (error) {
				this.$notifyUserAboutError(error)
			}
		},
	},
}
</script>