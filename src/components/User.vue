<template>
	<div v-loading.fullscreen="isLoading">
		<el-form
			ref="form"
			:model="user"
			:rules="rules"
			inline
			label-position="top"
		>
			<el-form-item label="Имя">
				<el-input v-model="user.firstName"/>
			</el-form-item>

			<el-form-item label="Фамилия">
				<el-input v-model="user.lastName"/>
			</el-form-item>

			<el-form-item label="Емейл" prop="email">
				<el-input
					v-model="user.email"
					:disabled="isInitialUser || isSelfEdit"
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

			<!-- <el-form-item v-if="!isCreationView" label="Зарегистрирован">
				<el-input :value="toDateTimeFormat(user.registered)" disabled/>
			</el-form-item> -->

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
		</el-form>

		<div>
			<el-button
				:loading="isSending"
				type="primary"
				@click="createOrSave"
			>{{ isCreationView ? 'Создать' : 'Сохранить' }}</el-button>

			<el-popover
				v-model="isUpdatePasswordVisible"
				trigger="manual"
			>
				<div class="d-flex">
					<el-input
						v-model="user.password"
						placeholder="Новый пароль"
						show-password
					/>

					<el-button
						type="success"
						class="ml-4"
						@click="updatePassword"
					>Сохранить</el-button>
				</div>

				<el-button
					slot="reference"
					class="ml-4"
					@click="isUpdatePasswordVisible = !isUpdatePasswordVisible"
				>Сменить пароль</el-button>
			</el-popover>

			<el-button
				v-if="!isCreationView && !isInitialUser"
				:loading="isSending"
				class="ml-4"
				@click="removeUser"
			>Удалить</el-button>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'

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
			isUpdatePasswordVisible: false,
			user: {
				email: '',
				firstName: '',
				lastName: '',
				password: '',
				phone: '',
				active: true,
			},
			rules: {
				email: [
					{ required: true, message: 'Поле обязательно', trigger: 'change' },
					{ type: 'email', message: 'Email содержит опечатки', trigger: 'change' },
				],
				password: [
					{ required: true, message: 'Поле обязательно', trigger: 'change' },
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
					this.user.id = (await this.$http.post('/users', this.user)).data
				} else {
					await this.$http.put(`/users/${this.userId}`, this.user)

					if (this.isSelfEdit) {
						this.$store.commit('users/setUser', {
							...this.currentUser,
							...this.user,
						})
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
			try {
				await this.$http.put('users/password', this.user)
				this.$notify.success({ title: 'Пароль обновлён' })
				this.isUpdatePasswordVisible = false
			} catch (error) {
				this.$notifyUserAboutError(error)
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