<template>
	<el-button
		type="text"
		@click="switchTheme"
	>Switch Theme</el-button>
</template>

<script>
export default {
	name: 'ThemeSwitcher',
	created() {
		const isDarkThemeTime = !(this.$dayjs().startOf('day').add(11, 'hour').toDate() < this.$dayjs() && this.$dayjs() < this.$dayjs().startOf('day').add(18, 'hour'))
		if (isDarkThemeTime) this.switchTheme()
	},
	methods: {
		switchTheme() {
			document.body.classList.toggle('dark-theme')
		},
	},
}
</script>

<style lang="scss">
body.dark-theme {
	&, .el-card, .el-input__inner, .el-textarea__inner, .is-plain {
		background: #222933;
		color: #eee;
		border-color: rgba(235, 238, 245, 0.2);
	}

	h1, h2, h3, h4, h5, h6 {
		color: #eee;
	}

	.shadow-light {
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 60%);
	}
}
</style>