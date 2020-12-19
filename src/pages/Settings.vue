<template>
	<div>
		<User
			:userId="user.id"
		/>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'Settings',
	components: {
		User: () => import('Components/User'),
	},
	computed: {
		...mapState({
			user: state => state.users.user,
		}),
	},
}
</script>