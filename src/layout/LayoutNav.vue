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
export default {
	name: 'LayoutSidebarNav',
	data() {
		return {
			navs: [],
		}
	},
	created() {
		this.setNavs()
	},
	methods: {
		setNavs() {
			this.$router.options.routes.forEach(nav => {
				if (!nav.meta || !nav.meta.isNav) return
				this.navs.push(nav)
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