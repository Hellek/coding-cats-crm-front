<template>
	<aside class="min-h-100vh">
		<LayoutSidebarNav/>
	</aside>
</template>

<script>
export default {
	name: 'LayoutSidebar',
	components: {
		LayoutSidebarNav: () => import('./LayoutSidebarNav'),
	},
}
</script>