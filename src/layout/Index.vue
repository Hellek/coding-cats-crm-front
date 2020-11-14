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

<style lang="scss">
@import 'ScssVariables';

::-webkit-scrollbar-track {
	background-color: rgba(235, 238, 245, 0.075);
}

::-webkit-scrollbar-thumb {
	background-color: rgba(235, 238, 245, 0.1);
}

html,
.el-card,
.el-table tr,
.el-input__inner,
.el-textarea__inner,
.is-plain {
	background: #222933;
	color: #eee;
	border-color: rgba(235, 238, 245, 0.2);
}

h1, h2, h3, h4, h5, h6 {
	color: #eee;
}

.shadow-hard {
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 60%);
}

.el-loading-mask {
	background-color: unset;
	animation: glow linear $--transition-base-duration * 7 infinite;
}

@keyframes glow {
	0% { background-color: none }
	50% { background-color: rgba(0, 0, 0, 0.7) }
	100% { background-color: none }
}
</style>