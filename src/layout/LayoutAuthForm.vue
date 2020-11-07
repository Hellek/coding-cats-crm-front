<template>
	<ElCard id="auth-form">
		<ElInput
			v-model="form.email"
			placeholder="Email"
			class="mb-4"
		/>
		<ElInput
			v-model="form.password"
			show-password
			placeholder="Пароль"
			class="mb-4"
		/>
		<ElButton
			class="w-100p"
			type="primary"
			@click="signIn"
		>Войти</ElButton>
	</ElCard>
</template>

<script>
export default {
	name: 'LayoutAuthForm',
	data() {
		return {
			form: {
				email: '',
				password: '',
			},
		}
	},
	methods: {
		async signIn() {
			try {
				await this.$store.dispatch('users/authorize', this.form)
			} catch (error) {
				this.$notifyUserAboutError(error)
			}
		},
	},
}
</script>

<style lang="scss">
#auth-form {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	max-width: 220px;
}
</style>