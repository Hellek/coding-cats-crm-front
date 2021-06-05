<template>
	<div v-loading.fullscreen="isLoading">
		<el-divider content-position="left" class="mt-2">Общие</el-divider>

		<el-form
			ref="form"
			:model="user"
			:rules="rules"
			inline
			label-position="top"
		>
			<el-form-item label="Имя">
				<el-input
					v-model="user.firstName"
					placeholder="Пётр"
				/>
			</el-form-item>

			<el-form-item label="Фамилия">
				<el-input
					v-model="user.lastName"
					placeholder="Чайковский"
				/>
			</el-form-item>

			<el-form-item label="Емейл" prop="email">
				<el-input
					v-model="user.email"
					:disabled="isInitialUser || isSelfEdit"
					placeholder="tchaikovsky@ya.ru"
				/>
			</el-form-item>

			<el-form-item
				v-if="isCreationView"
				label="Пароль"
				prop="password"
			>
				<el-input
					v-model="user.password"
					show-password
				/>
			</el-form-item>

			<el-form-item label="Телефон">
				<InputPhone v-model="user.phone" format="ru"/>
			</el-form-item>

			<el-form-item v-if="!isCreationView" label="Зарегистрирован">
				<el-input :value="user.created ? toDateTimeFormat(user.created) : null" disabled/>
			</el-form-item>

			<!-- <el-form-item label="Роль">
				<el-select
					v-model="user.role"
					:disabled="isInitialUser"
					class="w-100p"
				>
					<el-option
						v-for="role in roles"
						:key="role.id"
						:label="role.label"
						:value="role.id"
					/>
				</el-select>
			</el-form-item> -->

			<el-form-item label="Активен">
				<el-select
					v-model="user.active"
					:disabled="isInitialUser || isSelfEdit"
				>
					<el-option label="Да" :value="true"/>
					<el-option label="Нет" :value="false"/>
				</el-select>
			</el-form-item>

			<template v-if="isSelfEdit">
				<el-form-item
					v-for="token in tokensStructure"
					:key="token.name"
					:label="token.label"
				>
					<el-input
						v-model="user[token.name]"
						:placeholder="token.placeholder"
						show-password
					/>
				</el-form-item>
			</template>
		</el-form>

		<div>
			<el-button
				:loading="isSending"
				type="primary"
				@click="createOrSave"
			>{{ isCreationView ? 'Создать' : 'Сохранить' }}</el-button>

			<el-button
				v-if="!isCreationView && !isInitialUser"
				:loading="isSending"
				class="ml-4"
				@click="removeUser"
			>Удалить</el-button>
		</div>

		<div v-if="!isCreationView">

			<el-divider content-position="left">Прочее</el-divider>

			<el-form
				ref="updatePasswordForm"
				:model="user"
			>
				<el-form-item
					prop="password"
					:rules="user.password ? rules.password : null"
				>
					<el-input
						v-model="user.password"
						placeholder="Новый пароль"
						show-password
						class="max-width-base mr-4"
					/>

					<el-button @click="updatePassword">Сменить</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { isRequired, isEmail, minLength } from 'Utils/validationRules'
import { toDateTimeFormat } from 'Utils'

export default {
	name: 'User',
	components: {
		InputPhone: () => import('KitComponents/InputPhone'),
	},
	props: {
		userId: {
			type: Number,
			required: true,
		},
	},
	data() {
		return {
			isSending: false,
			isLoading: false,
			user: {
				email: '',
				firstName: '',
				lastName: '',
				password: '',
				phone: '',
				created: null,
				active: true,
				TISandboxToken: '',
				TIRealToken: '',
			},
			tokensStructure: [
				{
					label: 'Токен ТИ для торговли',
					name: 'TIRealToken',
					placeholder: 't.wTul5Ft...',
				},
				{
					label: 'Токен ТИ для песочницы',
					name: 'TISandboxToken',
					placeholder: 't.7U2DIIO...',
				},
			],
			rules: {
				email: [
					isRequired,
					isEmail,
				],
				password: [
					isRequired,
					minLength(12),
				],
			},
		}
	},
	computed: {
		...mapState({
			currentUser: state => state.users.user,
		}),
		isCreationView() {
			return !this.userId
		},
		isInitialUser() {
			return this.user.id === 1
		},
		isSelfEdit() {
			return this.user.id === this.currentUser.id
		},
	},
	async created() {
		if (this.isCreationView) {
			this.user.password = this.generatePassword()
		} else {
			this.isLoading = true
			await this.getUser()
			this.isLoading = false
		}
	},
	methods: {
		toDateTimeFormat,
		async getUser() {
			try {
				this.user = (await this.$http.get(`/users/${this.userId}`)).data
			} catch (error) {
				this.$notifyUserAboutError(error)
			}
		},
		generatePassword() {
			const length = 20
			const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
			let retVal = ''

			for (let i = 0, n = charset.length; i < length; ++i) {
				retVal += charset.charAt(Math.floor(Math.random() * n))
			}

			return retVal
		},
		async createOrSave() {
			if (!this.$isFormValid('form')) return
			this.isSending = true

			try {
				if (this.isCreationView) {
					this.user = (await this.$http.post('/users', this.user)).data
				} else {
					await this.$http.put(`/users/${this.userId}`, this.user)

					if (this.isSelfEdit) {
						await this.$store.dispatch('auth/authenticate', { refresh: true })
					}
				}

				this.$notify.success({
					title: `Пользователь ${this.isCreationView ? 'создан' : 'сохранен'}`,
				})

				if (this.isCreationView) {
					this.$router.replace({
						params: {
							id: this.user.id,
						},
					})
				}
			} catch (error) {
				this.$notifyUserAboutError(error)
			} finally {
				this.isSending = false
			}
		},
		async updatePassword() {
			if (!this.$isFormValid('updatePasswordForm')) return

			try {
				await this.$confirm('Старый пароль будет перезаписан. Вы уверены?', {
					confirmButtonText: 'Да',
					cancelButtonText: 'Нет',
					type: 'warning',
				})

				await this.$http.put('users/password', this.user)
				this.$notify.success({ title: 'Пароль обновлён' })
			} catch (error) {
				if (error === 'cancel') return
				this.$notifyUserAboutError(error)
			} finally {
				this.user.password = ''
			}
		},
		async removeUser() {
			this.isSending = true

			try {
				await this.$confirm('Данные будут удалены. Вы уверены?', {
					confirmButtonText: 'Да',
					cancelButtonText: 'Нет',
					type: 'warning',
				})

				await this.$http.delete(`/users/${this.userId}`)

				this.$router.push({ name: 'Users' })

				this.$notify.success({
					title: 'Пользователь удален',
				})
			} catch (error) {
				if (error === 'cancel') return
				this.$notifyUserAboutError(error)
			} finally {
				this.isSending = false
			}
		},
	},
}
</script>