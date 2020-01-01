<template>
	<div>
		<GoBackTitle :title="title"/>

		<el-alert
			v-if="isDefaultRole"
			:title="`«${role.label}» стандартная роль, её изменение невозможно`"
			type="success"
			show-icon
			class="mb-4"
		/>

		<!-- TODO название не может быть пустым -->
		<el-form ref="form" :model="role">
			<el-form-item label="Название">
				<el-input
					v-model="role.label"
					style="max-width: 260px;"
					:disabled="isDefaultRole"
				/>
			</el-form-item>
		</el-form>

		<div
			v-for="(service, serviceName) in role.rights"
			:key="serviceName"
			class="mb-7"
		>
			<h4 class="mb-3">Сервис {{ serviceName }}</h4>

			<el-checkbox
				v-for="(right, rightName) in service"
				:key="rightName"
				v-model="service[rightName].value"
				:label="`${rightName} (${right.desc})`"
				:disabled="isDefaultRole"
				class="mb-4 d-block"
			/>
		</div>

		<el-button
			type="primary"
			:disabled="isDefaultRole"
			@click="updateOrSave"
		>{{ isCreationView ? 'Создать' : 'Сохранить' }}</el-button>

		<el-button
			v-if="!isCreationView"
			:disabled="isDefaultRole"
			@click="removeRole"
		>Удалить</el-button>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
	name: 'User',
	components: {
		GoBackTitle: () => import('Components/GoBackTitle'),
	},
	data() {
		return {
			role: {
				label: 'Новая роль',
				rights: {},
			},
			rightsSchema: {},
		}
	},
	computed: {
		...mapState({
			roles: state => state.roles.list,
		}),
		roleId() {
			return this.$route.params.id
		},
		isCreationView() {
			return this.roleId === 'creation'
		},
		isDefaultRole() {
			return this.role.id === 1 || this.role.id === 2
		},
		title() {
			return this.isCreationView ? 'Новая роль' : `${this.$route.meta.label} №${this.roleId}`
		},
	},
	async created() {
		await Promise.all([
			this.fetchRoles(),
			this.getRightsSchema(),
		])

		this.setRole()
	},
	methods: {
		...mapActions({
			fetchRoles: 'roles/fetchRoles',
		}),
		async getRightsSchema() {
			this.rightsSchema = (await this.$http.get('/roles/rights-schema')).data
		},
		setRole() {
			if (this.roles[this.roleId]) {
				this.role = JSON.parse(JSON.stringify(this.roles[this.roleId]))
			}

			// Проставляем имеющиеся актуальные доступы и задаём новые
			const tempRights = {}

			Object.keys(this.rightsSchema).forEach(serviceName => {
				tempRights[serviceName] = {}

				Object.keys(this.rightsSchema[serviceName]).forEach(rightName => {
					tempRights[serviceName][rightName] = {}

					// По умолчанию false (доступ запрещён)
					let value = false

					// Или то что пришло из роли
					if (this.role.rights[serviceName] && typeof this.role.rights[serviceName][rightName] !== 'undefined') {
						value = this.role.rights[serviceName][rightName]
					}

					tempRights[serviceName][rightName].desc = this.rightsSchema[serviceName][rightName].desc
					tempRights[serviceName][rightName].value = value
				})
			})

			this.role.rights = tempRights
		},
		getPreparedRole() {
			const preparedRole = JSON.parse(JSON.stringify(this.role))

			Object.keys(preparedRole.rights).forEach(serviceName => {
				Object.keys(preparedRole.rights[serviceName]).forEach(rightName => {
					preparedRole.rights[serviceName][rightName] = preparedRole.rights[serviceName][rightName].value
				})
			})

			return preparedRole
		},
		async updateOrSave() {
			const preparedRole = this.getPreparedRole()

			try {
				if (this.isCreationView) {
					preparedRole.id = (await this.$http.post('/roles', preparedRole)).data
					this.role.id = preparedRole.id
				} else {
					await this.$http.put('/roles', preparedRole)
				}

				this.$store.dispatch('roles/setRole', preparedRole)

				this.$notify.success({
					title: this.isCreationView ? 'Роль создана' : 'Роль сохранена',
				})

				if (this.isCreationView) {
					this.$router.replace({
						path: `/role/${preparedRole.id}`,
					})
				}
			} catch (error) {
				this.$notifyUserAboutError(error)
			}
		},
		async removeRole() {
			try {
				await this.$http.delete(`/roles/${this.role.id}`)

				this.$store.dispatch('roles/removeRole', this.role.id)

				this.$router.push({ name: 'Roles' })

				this.$notify.success({
					title: 'Роль удалена',
				})
			} catch (error) {
				this.$notifyUserAboutError(error)
			}
		},
	},
}
</script>