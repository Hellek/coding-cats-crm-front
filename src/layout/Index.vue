<template>
	<div class="min-h-100vh d-flex">
		<LayoutAuthForm v-if="!isAuthorized"/>
		<template v-else>
			<LayoutSidebar/>
			<div class="d-flex flex-column flex-grow">
				<!-- <LayoutHeader/> -->
				<LayoutMain/>
			</div>
		</template>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'Layout',
	components: {
		LayoutAuthForm: () => import('./LayoutAuthForm'),
		LayoutSidebar: () => import('./LayoutSidebar'),
		// LayoutHeader: () => import('./LayoutHeader'),
		LayoutMain: () => import('./LayoutMain'),
	},
	computed: {
		...mapState({
			isAuthorized: state => state.users.isAuthorized,
		}),
	},
	created() {
		// this.$store.dispatch('users/setInitials')
	},
	sockets: {
		connect() {
			console.log('socket connected')
		},
		customEmit() {
			console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
		},
	},
}
</script>