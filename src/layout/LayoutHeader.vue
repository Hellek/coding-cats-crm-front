<template>
	<header class="d-flex justify-content-between align-items-center py-1 px-5 shadow-light flex-wrap">
		<LayoutNav/>

		<div>
			<ThemeSwitcher/>

			<el-button
				type="text"
				class="ml-3"
				@click="$store.dispatch('users/unauthorize')"
			>Выход</el-button>
		</div>
	</header>
</template>

<script>
export default {
	name: 'LayoutHeader',
	components: {
		LayoutNav: () => import('./LayoutNav'),
		ThemeSwitcher: () => import('./ThemeSwitcher'),
	},
}
</script>