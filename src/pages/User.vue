<template>
	<div>
		<GoBackTitle :title="title"/>

		<el-form
			ref="form"
			:model="user"
			:rules="rules"
			style="max-width: 260px;"
		>
			<el-form-item label="Имя">
				<el-input v-model="user.firstName"/>
			</el-form-item>
			<el-form-item label="Фамилия">
				<el-input v-model="user.lastName"/>
			</el-form-item>
			<el-form-item label="Емейл" prop="email">
				<el-input v-model="user.email"/>
			</el-form-item>
			<el-form-item v-if="isCreationView" label="Пароль">
				<el-input :value="user.password"/>
			</el-form-item>
			<el-form-item label="Телефон">
				<InputPhone v-model="user.phone" format="ru"/>
			</el-form-item>
			<el-form-item v-if="!isCreationView" label="Зарегистрирован">
				<el-input :value="toDateTimeFormat(user.registered)" disabled/>
			</el-form-item>
			<el-form-item label="Роль">
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
			</el-form-item>
			<el-form-item label="Активен">
				<el-select
					v-model="user.active"
					:disabled="isInitialUser"
					class="w-100p"
				>
					<el-option
						v-for="role in activeStatusList"
						:key="role.value"
						:label="role.label"
						:value="role.value"
					/>
				</el-select>
			</el-form-item>

			<el-button
				type="primary"
				@click="updateOrSave"
			>{{ isCreationView ? 'Создать' : 'Сохранить' }}</el-button>

			<el-button
				v-if="!isCreationView"
				:disabled="isInitialUser"
				@click="removeUser"
			>Удалить</el-button>
		</el-form>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { toDateTimeFormat } from 'Utils'

export default {
	name: 'User',
	components: {
		GoBackTitle: () => import('Components/GoBackTitle'),
		InputPhone: () => import('KitComponents/InputPhone'),
	},
	data() {
		return {
			user: {
				email: '',
				firstName: '',
				lastName: '',
				password: '',
				phone: '',
				role: 2,
				active: 0,
			},
			rules: {
				email: [
					{ type: 'email', message: 'Поле содержит опечатки', trigger: 'change' },
				],
			},
		}
	},
	computed: {
		...mapState({
			roles: state => state.roles.list,
			activeStatusList: state => state.users.activeStatusList,
		}),
		userId() {
			return this.$route.params.id
		},
		isCreationView() {
			return this.userId === 'creation'
		},
		isInitialUser() {
			return this.user.id === 1
		},
		title() {
			return this.isCreationView ? 'Создание пользователя' : `${this.$route.meta.label} №${this.userId}`
		},
	},
	created() {
		this.fetchRoles()

		if (!this.isCreationView) {
			this.getUser()
		} else {
			this.user.password = this.generatePassword()
		}
	},
	methods: {
		toDateTimeFormat,
		...mapActions({
			fetchRoles: 'roles/fetchRoles',
		}),
		async getUser() {
			this.user = (await this.$http.get(`/users/${this.userId}`)).data
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
		async updateOrSave() {
			if (!this.$isFormValid('form')) return

			try {
				if (this.isCreationView) {
					this.user.id = (await this.$http.post('/users', this.user)).data
				} else {
					await this.$http.put('/users', this.user)
				}

				this.$notify.success({
					title: this.isCreationView ? 'Пользователь создан' : 'Пользователь сохранен',
				})

				if (this.isCreationView) {
					this.$router.replace({
						path: `/users/${this.user.id}`,
					})
				}
			} catch (error) {
				this.$notifyUserAboutError(error)
			}
		},
		async removeUser() {
			try {
				await this.$http.delete(`/users/${this.user.id}`)

				this.$router.push({ name: 'Users' })

				this.$notify.success({
					title: 'Пользователь удален',
				})
			} catch (error) {
				this.$notifyUserAboutError(error)
			}
		},
	},
}
</script>