export default [
	{
		name: 'Home',
		path: '/',
		component: () => import('Pages/Home'),
		meta: {
			tags: [
				'homepage',
			],
		},
	},
	{
		name: 'Chat',
		path: '/chat',
		component: () => import('Pages/Chat'),
		meta: {
			isNav: true,
			label: 'Чат',
		},
	},
	{
		name: 'RestTest',
		path: '/rest-test',
		component: () => import('Pages/RestTest'),
		meta: {
			isNav: true,
			label: 'RestTest',
		},
	},
	{
		name: 'Roles',
		path: '/roles',
		component: () => import('Pages/Roles'),
		meta: {
			isNav: true,
			label: 'Роли',
		},
	},
	{
		name: 'Role',
		path: '/role/:id',
		component: () => import('Pages/Role'),
		meta: {
			label: 'Роль',
		},
	},
	{
		name: 'Users',
		path: '/users',
		component: () => import('Pages/Users'),
		meta: {
			isNav: true,
			label: 'Пользователи',
		},
	},
	{
		name: 'User',
		path: '/user/:id',
		component: () => import('Pages/User'),
		meta: {
			label: 'Пользователь',
		},
	},
	{
		name: 'The404',
		path: '*',
		component: () => import('KitComponents/PageNotFound'),
		meta: {
			ru: 'Страница не существует',
			tags: [],
		},
	},
]