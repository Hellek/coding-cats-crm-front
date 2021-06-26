<template>
	<div
		id="layout-sidebar-nav"
		class="d-flex flex-wrap mt-3"
	>
		<router-link
			v-for="nav in navs"
			:key="nav.name"
			:to="{name: nav.name}"
			class="mr-3 mb-3"
			@click.native="$emit('clicked')"
		>{{ nav.meta.label }}</router-link>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'LayoutSidebarNav',
	computed: {
		...mapState({
			user: state => state.users.user,
			navs: state => state.navs.navs,
		}),
	},
	created() {
		this.$store.dispatch('navs/setNavs', { router: this.$router })
	},
}
</script>

<style lang="scss">
#layout-sidebar-nav {
	.router-link-active {
		color: white;
		text-decoration: underline;
	}
}
</style>