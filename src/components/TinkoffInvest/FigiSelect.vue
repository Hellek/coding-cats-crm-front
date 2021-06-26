<template>
	<el-select
		v-model="figi"
		v-loading="isInstrumentsLoading"
		placeholder="Тикер / название"
		clearable
		filterable
		@change="setFigi"
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
import { mapGetters, mapState } from 'vuex'

export default {
	name: 'FigiSelect',
	props: {
		value: {
			type: String,
			default: null,
		},
		used: {
			type: Boolean,
			default: false,
		},
	},
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
		...mapGetters('tinkoffInvest', [
			'usedInstrumentsFlat',
		]),
		figiList() {
			if (this.used) return this.usedInstrumentsFlat

			return [
				...this.instruments.stocks,
				...this.instruments.bonds,
				...this.instruments.etfs,
				...this.instruments.currencies,
			]
		},
	},
	watch: {
		value: {
			immediate: true,
			handler(newValue) {
				if (this.newValue === this.figi) return
				this.figi = newValue
			},
		},
	},
	methods: {
		setFigi(figi) {
			this.$emit('input', figi)
			this.$emit('change', figi)
		},
	},
}
</script>