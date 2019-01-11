module.exports = {
	// 基本路径
	baseUrl: '/',
	// 输出文件目录
	outputDir: 'dist',
	// 用于嵌套生成的静态资产（js，css，img，fonts）的目录。
	//assetsDir: '',
	// 以多页模式构建应用程序。
	pages: undefined,
	// eslint-loader 是否在保存的时候检查
	lintOnSave: true,
	// 是否使用包含运行时编译器的Vue核心的构建。
	runtimeCompiler: false,
	// 默认情况下babel-loader忽略其中的所有文件node_modules。
	transpileDependencies: [],
	// 生产环境sourceMap
	productionSourceMap: false,
	// webpack配置
	configureWebpack: () => { },
	chainWebpack: () => {
		config => {
			config.module
			.rule('vue')
			.use('vue-loader')
			.loader('vue-loader')
			.tap(options => {
				// 修改它的选项...
				return options
			})
		}
	},
	// css相关配置
	css: {
		// 启用 CSS modules
		modules: false,
		// 开启 CSS source maps?
		sourceMap: false,
		// css预设器配置项
		loaderOptions: {},
	},
	// webpack-dev-server 相关配置
	devServer: {
		host: '0.0.0.0',
		port: 8088,
		https: false,
		// autoOpenBrowser: true,//是否自动打开浏览器
		hotOnly: false,
        disableHostCheck: true,
		// 设置代理
		proxy: {
			'/api': {
				target: 'http://10.9.51.1:10000',
				//     ws: true,
                //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
				changeOrigin: true,
				pathRewrite: {  
					'^/api': '/'   //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉  
				}
			}
		},
		// 提供在服务器内部的其他中间件之前执行自定义中间件的能力
		// `app`是一个express实例
		before: app => {
			console.log('app===', app)
		}
	},
	// enabled by default if the machine has more than 1 cores
	parallel: require('os').cpus().length > 1,
	// PWA 插件相关配置
	pwa: {},
	// 第三方插件配置
	pluginOptions: {
		// ...
	}
}