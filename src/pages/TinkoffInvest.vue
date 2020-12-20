<template>
	<el-card v-loading="isUserAccountsLoading">
		<div class="d-flex align-items-center">
			<h1 class="flex-shrink mb-0">
				<el-switch
					v-model="isSandbox"
					:active-value="true"
					:inactive-value="false"
					class="mr-4"
				/>

				<span
					:class="isSandbox ? 'color-success' : 'color-danger'"
				>{{ isSandbox ? 'Режим песочницы' : 'Реальный счёт' }}</span>
			</h1>

			<el-divider
				direction="vertical"
				class="mx-5"
			/>

			<el-input
				v-if="!isTokenValid"
				:value="isSandbox ? sandboxToken : realToken"
				clearable
				placeholder="Укажите токен"
				show-password
				style="max-width: 200px;"
				@input="setToken"
			/>

			<el-select
				v-else
				v-model="currentUserAccount"
				placeholder="Счёт"
			>
				<el-option
					v-for="acc in userAccounts"
					:key="acc.brokerAccountId"
					:label="acc.brokerAccountType"
					:value="acc.brokerAccountId"
				/>
			</el-select>

			<el-button
				:loading="isUserAccountsLoading"
				type="primary"
				class="ml-4"
				@click="isTokenValid ? dropToken() : setUserAccounts()"
			>{{ isTokenValid ? 'Выйти' : 'Войти' }}</el-button>
		</div>

		<div
			v-if="isTokenValid && isCommonDataLoaded"
			class="mt-4"
		>
			<el-tabs
				v-if="!isUserAccountsLoading"
				v-model="tab"
			>
				<el-tab-pane
					v-for="currentTab in tabs"
					:key="currentTab.name"
					:label="currentTab.label"
					:name="currentTab.name"
				>
					<component
						:is="currentTab.name"
						v-if="tab === currentTab.name"
						:api="api"
						:is-sandbox="isSandbox"
						:account="currentUserAccount"
						:stocks="stocks"
						:bonds="bonds"
						:etfs="etfs"
						:currencies="currencies"
					/>
				</el-tab-pane>
			</el-tabs>
		</div>
	</el-card>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
	name: 'TinkoffInvest',
	components: {
		Operations: () => import('Components/TinkoffInvest/Operations'),
	},
	data() {
		return {
			isSandbox: false,
			isTokenValid: false,
			isUserAccountsLoading: false,
			isCommonDataLoaded: false,
			tab: 'Operations',
			tabs: [
				{
					name: 'Operations',
					label: 'Операции',
				},
			],
			currentUserAccount: null,
			userAccounts: [],
			api: {},
			stocks: '',
			bonds: '',
			etfs: '',
			currencies: '',
		}
	},
	computed: {
		...mapState('tinkoffInvest', [
			'sandboxToken',
			'realToken',
		]),
		apiURL() {
			return `https://api-invest.tinkoff.ru/openapi${this.isSandbox ? '/sandbox' : ''}`
		},
		secretToken() {
			return this.isSandbox ? this.sandboxToken : this.realToken
		},
	},
	watch: {
		isSandbox: {
			immediate: true,
			handler: 'setUserAccounts',
		},
		async isTokenValid() {
			[
				this.stocks,
				this.bonds,
				this.etfs,
				this.currencies,
			] = await Promise.all([
				this.fetchMarket('stocks'),
				this.fetchMarket('bonds'),
				this.fetchMarket('etfs'),
				this.fetchMarket('currencies'),
			])

			this.isCommonDataLoaded = true
		},
	},
	methods: {
		setApi() {
			this.api = axios.create({
				baseURL: this.apiURL,
				withCredentials: false,
				headers: {
					Authorization: `Bearer ${this.secretToken}`,
				},
			})
		},
		async fetchUserAccounts() {
			const { data } = await this.api.get('user/accounts')
			return data.payload.accounts
		},
		async setUserAccounts() {
			// Примитивная валидация
			if (this.secretToken.length < 50) {
				this.isTokenValid = false
				return
			}

			this.setApi()

			try {
				this.isUserAccountsLoading = true
				this.userAccounts = await this.fetchUserAccounts()
				this.currentUserAccount = this.userAccounts[0].brokerAccountId
				this.isTokenValid = true
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log(error)
				this.$notifyUserAboutError('Вероятно не валидный токен')
			} finally {
				this.isUserAccountsLoading = false
			}
		},
		setToken(token) {
			if (this.isSandbox) this.$store.commit('tinkoffInvest/setSandboxToken', token)
			else this.$store.commit('tinkoffInvest/setRealToken', token)
		},
		dropToken() {
			if (this.isSandbox) this.$store.commit('tinkoffInvest/setSandboxToken', '')
			else this.$store.commit('tinkoffInvest/setRealToken', '')
			this.userAccounts = []
			this.isTokenValid = false
		},
		async fetchMarket(instrument) {
			const { data } = await this.api.get(`market/${instrument}`)
			return data.payload.instruments
		},
	},
}
</script>