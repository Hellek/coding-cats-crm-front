<template>
	<el-select
		v-model="figi"
		v-loading="isInstrumentsLoading"
		placeholder="Тикер / название"
		clearable
		filterable
		@change="$emit('selected', $event)"
	>
		<el-option
			v-for="i in figiList"
			:key="i.figi"
			:label="`${i.ticker} (${i.name})`"
			:value="i.figi"
		/>
	</el-select>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'FigiSelect',
	data() {
		return {
			figi: null,
		}
	},
	computed: {
		...mapState('tinkoffInvest', [
			'isInstrumentsLoading',
			'instruments',
		]),
		figiList() {
			return [
				...this.instruments.stocks,
				...this.instruments.bonds,
				...this.instruments.etfs,
				...this.instruments.currencies,
			]
		},
	},
	created() {
		this.$store.dispatch('tinkoffInvest/setAllInstuments')
	},
}
</script>