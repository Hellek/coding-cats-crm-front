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