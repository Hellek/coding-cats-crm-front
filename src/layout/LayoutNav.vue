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
	data() {
		return {
			navs: [],
		}
	},
	computed: {
		...mapState({
			user: state => state.users.user,
		}),
	},
	created() {
		this.setNavs()
	},
	methods: {
		setNavs() {
			this.$router.options.routes.forEach(nav => {
				if (!nav.meta || !nav.meta.isNav) return

				if (!nav.meta.allowedUserId) {
					this.navs.push(nav)
					return
				}

				if (nav.meta.allowedUserId.includes(this.user.id)) this.navs.push(nav)
			})
		},
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