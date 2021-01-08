<template>
	<el-button
		:icon="isDark ? 'el-icon-moon' : 'el-icon-sunny'"
		circle
		@click="switchTheme"
	/>
</template>

<script>
export default {
	name: 'ThemeSwitcher',
	data() {
		return {
			isDark: true,
		}
	},
	created() {
		// const isDarkThemeTime = !(this.$dayjs().startOf('day').add(11, 'hour').toDate() < this.$dayjs() && this.$dayjs() < this.$dayjs().startOf('day').add(18, 'hour'))
		// if (isDarkThemeTime) this.switchTheme()
		// this.switchTheme()
	},
	methods: {
		switchTheme() {
			this.isDark = !this.isDark
			document.documentElement.classList.toggle('dark-theme')
		},
	},
}
</script>

<style lang="scss">
@import 'ScssVariables';

html.dark-theme {
	::-webkit-scrollbar-track {
		background-color: rgba(235, 238, 245, 0.075);
	}

	::-webkit-scrollbar-thumb {
		background-color: rgba(235, 238, 245, 0.1);
	}

	&, .el-card, .el-input__inner, .el-textarea__inner, .is-plain {
		background: #222933;
		color: #eee;
		border-color: rgba(235, 238, 245, 0.2);
	}

	h1, h2, h3, h4, h5, h6 {
		color: #eee;
	}

	.el-notification__title {
		color: #222933;
	}

	.shadow-hard {
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 60%);
	}
}
</style>