<template>
	<header class="d-flex justify-content-between align-items-center py-1 px-4 shadow-hard flex-wrap position-relative">
		<i
			v-if="$breakpoints.smAndDown"
			class="el-icon-menu color-white font-size-large clickable"
			@click="isDrawerVisible = true"
		/>

		<LayoutNav
			v-if="!$breakpoints.smAndDown"
		/>

		<el-drawer
			v-else
			ref="drawer"
			class="no-header"
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
			<ThemeSwitcher/>

			<!-- <el-button
				icon="el-icon-chat-dot-round"
				circle
				@click="showChat"
			/> -->

			<el-button
				:loading="isUnauthorizing"
				@click="unauthorize"
			>Выход</el-button>

			<!-- <el-drawer
				class="no-header"
				:size="$breakpoints.smAndDown ? '85%' : '480px'"
				:visible.sync="isChatVisible"
			>
				<Chat class="mt-5"/>
			</el-drawer> -->
		</div>
	</header>
</template>

<script>
export default {
	name: 'LayoutHeader',
	components: {
		LayoutNav: () => import('./LayoutNav'),
		// Chat: () => import('Components/Chat'),
		ThemeSwitcher: () => import('./ThemeSwitcher'),
	},
	data() {
		return {
			isUnauthorizing: false,
			isDrawerVisible: false,
			isChatVisible: false,
		}
	},
	methods: {
		async unauthorize() {
			this.isUnauthorizing = true
			await this.$store.dispatch('auth/unauthorize')
			this.isUnauthorizing = false
		},
		showChat() {
			this.isChatVisible = true
		},
	},
}
</script>

<style lang="scss">
.no-header {
	.el-drawer__header {
		display: none;
	}
}
</style>