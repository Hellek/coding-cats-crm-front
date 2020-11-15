<template>
	<ElCard id="auth-form">
		<ElInput
			v-if="!isChangePasswordMode"
			v-model="form.email"
			placeholder="Email"
			class="mb-4"
		/>

		<ElInput
			v-if="!isRememberPasswordMode"
			v-model="form.password"
			show-password
			:placeholder="isChangePasswordMode ? 'Новый пароль' : 'Пароль'"
			class="mb-4"
		/>

		<ElButton
			:loading="isSending"
			class="w-100p"
			type="primary"
			@click="signIn"
		>{{ signInLabel }}</ElButton>

		<el-button
			v-if="isForgetQuestionVisible && !isRememberPasswordMode"
			class="w-100p ml-0 mt-4"
			@click="isRememberPasswordMode = true"
		>Я забыл пароль</el-button>
	</ElCard>
</template>

<script>
export default {
	name: 'LayoutAuthForm',
	data() {
		return {
			isSending: false,
			isForgetQuestionVisible: false,
			isChangePasswordMode: false,
			isRememberPasswordMode: false,
			form: {
				email: '',
				password: '',
			},
		}
	},
	computed: {
		signInLabel() {
			if (this.isRememberPasswordMode) return 'Отправить на почту'
			return this.isChangePasswordMode ? 'Сохранить и войти' : 'Войти'
		},
	},
	created() {
		if (this.$route.query['set-new-password'] === 'true') {
			this.isChangePasswordMode = true

			this.form = {
				...this.form,
				...this.$route.query,
			}

			this.$router.replace({ query: null })
		}
	},
	methods: {
		async signIn() {
			this.isSending = true

			try {
				if (this.isRememberPasswordMode) {
					const res = (await this.$http.post('auth/password/reset', this.form)).data
					this.$notify.success({ title: res })
					this.isForgetQuestionVisible = false
					this.isRememberPasswordMode = false
					return
				}

				if (this.isChangePasswordMode) {
					await this.$http.put('auth/password', this.form)
				}

				await this.$store.dispatch('users/authorize', this.form)
			} catch (error) {
				if (!this.isChangePasswordMode) this.isForgetQuestionVisible = true
				this.$notifyUserAboutError(error)
			} finally {
				this.isSending = false
			}
		},
	},
}
</script>

<style lang="scss">
@import 'ScssVariables';

#auth-form {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	max-width: 240px;

	@media screen and (max-width: $--sm) {
		width: 90%;
	}
}
</style>