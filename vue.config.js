const KitVueConfigs = require('./node_modules/element-ui-kit/vue.configs')

module.exports = {
	...KitVueConfigs.vueConfig,
	configureWebpack: {
		...KitVueConfigs.vueConfig.configureWebpack,
		resolve: {
			alias: {
				ScssVariables: '@/assets/styles/variables.scss',
				...KitVueConfigs.getAliases({
					dirname: __dirname,
				}),
			},
		},
	},
}