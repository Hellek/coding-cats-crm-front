<template>
	<el-select
		v-loading="isUserAccountsLoading"
		:value="isUserAccountsLoading ? null : brokerAccountId"
		placeholder="Счёт"
		@change="$store.commit('tinkoffInvest/setBrokerAccountId', $event)"
	>
		<el-option
			v-for="acc in userAccounts"
			:key="acc.brokerAccountId"
			:label="acc.label"
			:value="acc.brokerAccountId"
		/>
	</el-select>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'Accounts',
	data() {
		return {
			isUserAccountsLoading: false,
			userAccounts: [],
		}
	},
	computed: {
		...mapState('tinkoffInvest', [
			'brokerAccountId',
		]),
	},
	created() {
		this.getAccounts()
	},
	methods: {
		async getAccounts() {
			try {
				this.isUserAccountsLoading = true

				const { data } = await this.$http.get('tinkoff-investments/accounts')

				data.forEach(acc => {
					switch (acc.brokerAccountType) {
					case 'Tinkoff': acc.label = 'Основной счёт'; break
					case 'TinkoffIis': acc.label = 'ИИС'; break
					default: break
					}
				})

				// Устанавливаем счет по умолчанию, если не было
				if (!this.brokerAccountId && data[0]) this.$store.commit('tinkoffInvest/setBrokerAccountId', data[0].brokerAccountId)

				this.userAccounts = data
			} catch (error) {
				this.$notifyUserAboutError(error)
			} finally {
				this.isUserAccountsLoading = false
			}
		},
	},
}
</script>