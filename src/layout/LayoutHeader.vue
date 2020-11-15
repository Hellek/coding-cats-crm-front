<template>
	<header class="d-flex justify-content-between align-items-center py-1 px-5 shadow-hard flex-wrap position-relative">
		<i
			v-if="$breakpoints.smAndDown"
			class="el-icon-menu color-white font-size-large clickable"
			@click="isDrawerVisible = true"
		/>
		<!-- @click="$refs.drawer.closeDrawer()" -->

		<LayoutNav
			v-if="!$breakpoints.smAndDown"
		/>

		<el-drawer
			v-else
			id="header-drawer"
			ref="drawer"
			:visible.sync="isDrawerVisible"
			:with-header="false"
			:append-to-body="true"
			:show-close="false"
			direction="ltr"
			size="60%"
		>
			<LayoutNav
				class="flex-column"
				@clicked="isDrawerVisible = false"
			/>
		</el-drawer>

		<div>
			<!-- <ThemeSwitcher/> -->

			<el-button
				:loading="isUnauthorizing"
				@click="unauthorize"
			>Выход</el-button>
		</div>
	</header>
</template>

<script>
export default {
	name: 'LayoutHeader',
	components: {
		LayoutNav: () => import('./LayoutNav'),
		// ThemeSwitcher: () => import('./ThemeSwitcher'),
	},
	data() {
		return {
			isUnauthorizing: false,
			isDrawerVisible: false,
		}
	},
	methods: {
		async unauthorize() {
			this.isUnauthorizing = true
			await this.$store.dispatch('users/unauthorize')
			this.isUnauthorizing = false
		},
	},
}
</script>

<style lang="scss">
#header-drawer {
	.el-drawer__header {
		display: none;
	}
}
</style>