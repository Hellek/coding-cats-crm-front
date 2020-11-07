<template>
	<div class="min-h-100vh d-flex">
		<LayoutAuthForm v-if="!isAuthorized"/>

		<div
			v-else
			class="d-flex flex-column flex-grow"
		>
			<LayoutHeader/>
			<LayoutMain/>
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
			isAuthorized: state => state.users.isAuthorized,
		}),
	},
}
</script>