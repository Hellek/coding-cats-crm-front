<template>
	<div
		id="layout-sidebar-nav"
		class="d-flex flex-column shadow-light"
		style="min-height: 100%;"
	>
		<router-link
			v-for="nav in navs"
			:key="nav.name"
			:to="{name: nav.name}"
			class="p-3"
		>{{ nav.meta.label }}</router-link>

		<ThemeSwitcher
			class="mx-3"
		/>

		<el-button
			type="primary"
			plain
			class="mx-3 mt-3"
			@click="$store.dispatch('users/unauthorize')"
		>Выход</el-button>
	</div>
</template>

<script>
export default {
	name: 'LayoutSidebarNav',
	components: {
		ThemeSwitcher: () => import('./ThemeSwitcher'),
	},
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
	// router-link-exact-active router-link-active
}
</style>