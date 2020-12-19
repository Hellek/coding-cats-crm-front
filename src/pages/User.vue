<template>
	<div>
		<User
			:user-id="+$route.params.id"
		/>
	</div>
</template>

<script>
export default {
	name: 'UserPage',
	components: {
		User: () => import('Components/User'),
	},
}
</script>