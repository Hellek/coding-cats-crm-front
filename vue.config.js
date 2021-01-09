const KitVueConfigs = require('./node_modules/element-ui-kit/vue.configs')

module.exports = {
	...KitVueConfigs.vueConfig,
	configureWebpack: {
		...KitVueConfigs.vueConfig.configureWebpack,
		resolve: {
			alias: {
				'element-ui/lib/locale/lang/zh-CN': 'element-ui/lib/locale/lang/ru-RU',
				ScssVariables: '@/assets/styles/variables.scss',
				...KitVueConfigs.getAliases({
					dirname: __dirname,
				}),
			},
		},
	},
}