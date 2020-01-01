<template>
	<h1 class="mt-0 d-flex">
		<div
			class="d-flex align-items-center mr-1 clickable"
			:class="hasHistory ? 'color-primary' : 'color-placeholder'"
			@click="goBack"
		>&#9665;</div>
		<span>{{ title }}</span>
	</h1>
</template>

<script>
export default {
	name: 'GoBackTitle',
	props: {
		title: {
			type: String,
			required: true,
		},
	},
	computed: {
		hasHistory() {
			return window.history.length > 0
		},
	},
	methods: {
		goBack() {
			this.$router.go(-1)
		},
	},
}
</script>