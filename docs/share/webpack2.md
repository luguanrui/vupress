# webpack2

构建工具 [webpack2.0](https://doc.webpack-china.org/configuration/)

安装webpack, webpack-dev-server
```bash
npm i webpack -g
npm i webpack webpack-dev-server -D
```

安装react,react-dom
```bash
npm i react react-dom -S
```

## 开发环境的webpack配置

webpack.config.js 文件

是一个符合commonJS规范的普通js文档，最后输出一个对象module.exports={...}

### webpack相关命令

- webpack     执行一次开发的编译
- webpack -p  对打包后的文件进行压缩
- webpack -w  提供watch方法，实时进行打包更新
- webpack -d  提供source map，方便调试
- webpack --config XXX.js   使用另一份配置文件（比如webpack.config2.js）来打包

### scripts脚本

```bash
"scripts": {
    "start": "NODE_ENV=dev webpack-dev-server --progress --colors"
}
```   

相关参数：

- --progress 显示打包过程中的进度
- --colors   打包信息带有颜色显示 
- –-hot      热加载，代码修改完后自动刷新 
- –-inline   是刷新后的代码自动注入到打包后的文件中(当源文件改变时会自动刷新页面) 
- -d         是debug模式，输入一个source-map，并且可以看到每一个打包的文件 
- -p         是对代码进行压缩 

### 相关配置

#### devtool

生成source maps，开发总是离不开调试，方便的调试能极大的提高开发效率，不过有时候通过打包后的文件，你是不容易找到出错了的地方，对应的你写的代码的位置的，Source Maps就是来帮我们解决这个问题的。通过简单的配置，webpack就可以在打包时为我们生成的source maps，这为我们提供了一种对应编译文件和源文件的方法，使得编译后的代码可读性更高，也更容易调试。
	
四个选项：
1. source-map：在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的source map，但是它会减慢打包速度；
2. cheap-module-source-map：在一个单独的文件中生成一个不带列映射的map，不带列映射提高了打包速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号），会对调试造成不便；
3. eval-source-map：使用eval打包源文件模块，在同一个文件中生成干净的完整的source map。这个选项可以在不影响构建速度的前提下生成完整的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项，在生产阶段则一定不要启用这个选项；
4. cheap-module-eval-source-map：这是在打包文件时最快的生成source map的方法，生成的Source Map 会和打包后的JavaScript文件同行显示，没有列映射，和eval-source-map选项具有相似的缺点；

正如上表所述，上述选项由上到下打包速度越来越快，不过同时也具有越来越多的负面作用，较快的打包速度的后果就是对打包后的文件的的执行有一定影响。对小到中型的项目中，eval-source-map是一个很好的选项，再次强调你只应该开发阶段使用它

devtool:'eval-source-map'

#### devServer

参数：

1. contentBase:默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录
2. port:设置默认监听端口，如果省略，默认为”8080“
3. inline:	设置为true，当源文件改变时会自动刷新页面
4. historyApiFallback:在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
5. host：默认是'localhost'
6. hot：true，启用 webpack 的模块热替换特性
7. open：true
8. proxy：是个对象，有参数配置

```js
devServer: {
    contentBase: "./public",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    inline: true//实时刷新
} 
```

#### loaders说明

```js
module:{
    rules:[
        {
            test: 一个用以匹配loaders所处理文件的拓展名的正则表达式（必须）,
            loader: loader的名称（必须）
            include/exclude: 手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）；
            query: 为loaders提供额外的设置选项（可选）			
        },
    ]
}
```

#### babel说明

npm一次性安装多个依赖模块，模块之间用空格隔开:

```bash
npm i babel-core babel-loader babel-preset-es2015 babel-preset-react -D
```

babel的使用：

webpack.config.js:
```js
module: {
    rules: [
        {
            test: /\.(jsx | js)$/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["es2015", "react"]
                }
            },
            exclude: /node_modules/
        }
    ]
}
```

Babel其实可以完全在 webpack.config.js 中进行配置，但是考虑到babel具有非常多的配置选项，在单一的webpack.config.js文件中进行配置往往使得这个文件显得太复杂，因此一些开发者支持把babel的配置选项放在一个单独的名为 ".babelrc" 的配置文件中。我们现在的babel的配置并不算复杂，不过之后我们会再加一些东西，因此现在我们就提取出相关部分，分两个配置文件进行配置（webpack会自动调用.babelrc里的babel配置选项）
	
webpack.config.js:

```js
module: {
    rules: [
        {
            test: /\.（jsx | js)$/,
            use: {
                loader: "babel-loader"
            },
            exclude: /node_modules/
        }
    ]
}
```
.babelrc

```bash
{
    "presets": ["react", "es2015"]
}
```
#### css-loader,style-loader

webpack提供两个工具处理样式表，css-loader 和 style-loader，二者处理的任务不同：
1. css-loader使你能够使用类似@import 和 url(...)的方法实现 require()的功能
2. style-loader将所有的计算后的样式加入页面中，二者组合在一起使你能够把样式表嵌入webpack打包后的JS文件中。
```bah
npm i css-loader style-loader -D
```

webpack.config.js
```js
module: {
    rules: [
        {
            test: /\.css$/,
            use: [
                {
                    loader: "style-loader"
                },
                {
                    loader: "css-loader",
                    options:{
                        modules:true
                    }
                }
            ]
        }
    ]
}
```

CSS Modules，即CSS模块化，通过CSS模块，所有的类名，动画名默认都只作用于当前模块。Webpack从一开始就对CSS模块化提供了支持，在CSS loader中进行配置后，你所需要做的一切就是把”modules“传递到所需要的地方，然后就可以直接把CSS的类名传递到组件的代码中，且这样做只对当前组件有效，不必担心在不同的模块中使用相同的类名造成冲突

#### CSS预处理器

安装 postcss-loader 和 autoprefixer（自动添加前缀的插件）
```bash
npm i postcss-loader autoprefixer -D
```

webpack.config.js
```js
module.exports={
    entry:'...',
    output:'...',
    module:{
        rules:[
            {
                test:/\.css$/
                use:[
                    {
                        loader:'style-loader'
                    },
                    {
                        loader:'css-laoder',
                        options:{
                            modules:true
                        }
                    },
                    {
                        loader:'postcss-loader'
                    }
                ]
            }
        ]
    },
    plugins:[
        require('autoprefixer')
    ]

}
```
#### plugins

要使用某个插件，我们需要通过npm安装它，然后要做的就是在webpack配置中的plugins关键字部分添加该插件的一个实例（plugins是一个数组）

添加了一个给打包后代码添加版权声明的插件:

```js
const webpack = require('webpack');

module.exports={
    ...
    plugins:[
            new webpack.BannerPlugin('版权所有，翻版必究')
    ]
}
```

#### HtmlWebpackPlugin插件

作用:依据一个简单的index.html模板，生成一个自动引用你打包后的JS文件的新index.html。这在每次生成的js文件名称不同时非常有用（比如添加了hash值）。

安装：
```bash
npm i html-webpack-plugin -D
```
webpack.config.js
```js
module.exports={
    ...
    plugins:[
            new HtmlWebpackPlugin({
            template: path.join(__dirname, 'default_index.ejs'),
            filename: 'index.html',
            hash: false,
            inject: true,
            compile: true,
            favicon: false,
            minify: false,
            cache: true,
            showErrors: true,
            chunks: 'all',
            excludeChunks: [],
            title: 'Webpack App',
            xhtml: false
            })
    ]
}
```

说明：
1. template: path.join(\_\_dirname, 'default_index.ejs'),
	
	本地模板文件的位置，支持加载器(如handlebars、ejs、undersore、html等)，比如 handlebars!src/index.hbs
	
	1、template配置项在html文件使用 file-loader 时，其所指定的位置找不到，导致生成的html文件内容不是期望的内容。
	
	2、为template指定的模板文件没有指定任何loader的话，默认使用ejs-loader。如template: './index.html'，若没有为.html指定任何loader就使用ejs-loader

2. filename: 'index.html'

	输出文件的文件名称，默认为index.html，不配置就是该文件名；此外，还可以为输出文件指定目录位置（例如'html/index.html'）
	
	1、filename配置的html文件目录是相对于webpackConfig.output.path路径而言的，不是相对于当前项目目录结构的。
	
	2、指定生成的html文件内容中的link和script路径是相对于生成目录下的，写路径的时候请写生成目录下的相对路径。

3. title

	生成的html文档的标题。配置该项，它并不会替换指定模板文件中的title元素的内容，除非html模板文件中使用了模板引擎语法来获取该配置项值，如下ejs模板语法形式：

		<title><%= htmlWebpackPlugin.options.title %></title>

#### Hot Module Replacement -- 模块热替换（不适用于生产环境）

Hot Module Replacement（HMR）也是webpack里很有用的一个插件，它允许你在修改组件代码后，自动刷新实时预览修改后的效果。

在webpack中实现HMR也很简单，只需要做两项配置：
1. 在webpack配置文件中添加HMR插件；( webpack内置了HMR插件webpack.HotModuleReplacementPlugin() )
2. 在webpack-dev-server中添加“hot”参数；

不过配置完这些后，JS模块其实还是不能自动热加载的，还需要在你的JS模块中执行一个Webpack提供的API才能实现热加载，虽然这个API不难使用，但是如果是React模块，使用我们已经熟悉的Babel可以更方便的实现功能热加载。Babel有一个叫做react-transform-hmr的插件，可以在不对React模块进行额外的配置的前提下让HMR正常工作；

```bash
npm install --save-dev babel-plugin-react-transform react-transform-hmr
```
webpack.config.js
```js
const webpack = require('webpack');
module.exports = {
    ...
    devServer: {
        contentBase: "./public",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true,
        hot: true	// 必须的
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()//热加载插件
    ],
};
```
.babelrc
```bash
{
    "presets": ["react", "es2015"],
    "env": {
    "development": {
    "plugins": [["react-transform", {
        "transforms": [{
            "transform": "react-transform-hmr",
            
            "imports": ["react"],
            
            "locals": ["module"]
        }]
        }]]
    }
    }
}
```

#### open-browser-webpack-plugin 自动打开浏览器插件

```js
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

plugins:[
    new OpenBrowserPlugin({
        url:'http://localhost:3000'
    })
]
```
## 生产环境的webpack配置

webpack.production.config.js 文件

开发环境下，可以不用考虑系统的性能，更多考虑的是如何增加开发效率。而发布系统时，就需要考虑发布之后的系统的性能，包括加载速度、缓存等。
下面介绍发布用配置代码和开发用的不一样的地方。
发布到 `./build` 文件夹中 ： `path: __dirname + "/build",`

### vendor

将第三方依赖单独打包。即将 node_modules 文件夹中的代码打包为 vendor.js 将我们自己写的业务代码打包为 app.js。这样有助于缓存，因为在项目维护过程中，第三方依赖不经常变化，而业务代码会经常变化。

### md5后缀

为每个打包出来的文件都加md5后缀，例如`"/js/[name].[chunkhash:8].js"`，可使文件强缓存。
分目录
打包出来的不同类型的文件，放在不同目录下，例如图片文件将放在`img/`目录下

### Copyright

自动为打包出来的代码增加 copyright 内容

### 分模块

`new webpack.optimize.OccurenceOrderPlugin(),`

### 压缩代码

使用 Uglify 压缩代码，其中`warnings: false`是去掉代码中的 warning

### 分离css和js文件

开发环境下，css 代码是放在整个打包出来的那个 bundle.js 文件中的，发布环境下当然不能混淆在一起，使用`new ExtractTextPlugin('/css/[name].[chunkhash:8].css'),`将 css 代码分离出来。

### build
```bash
"scripts": {
    "start": "NODE_ENV=dev webpack-dev-server --progress --colors",
    "build": "rm -rf ./build && NODE_ENV=production webpack --config ./webpack.production.config.js --progress --colors"
},
```
### 说明

以上都是开发阶段的构建，下面是生产时的构建，比如，优化，压缩，缓存以及分离CSS和JS。

webpack.production.config.js，在里面加上基本的配置,它和原始的webpack.config.js很像

package.json

```bash
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack",
    "server": "webpack-dev-server --open",
    "build": "NODE_ENV=production webpack --config ./webpack.production.config.js --progress"
}
```
### 优化方案

webpack提供了一些在发布阶段非常有用的优化插件：

- OccurenceOrderPlugin : 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
- UglifyJsPlugin：压缩JS代码；
- ExtractTextPlugin：分离CSS和JS文件

OccurenceOrder 和 UglifyJS plugins 都是内置插件，你需要做的只是安装其它非内置插件
```bash
npm i extract-text-webpack-plugin -D
```
webpack.production.config.js

```js
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    ...
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin("style.css")
    ],
};
```
### 缓存

缓存无处不在，使用缓存的最好方法是保证你的文件名和文件内容是匹配的（内容改变，名称相应改变）

webpack可以把一个哈希值添加到打包的文件名中，使用方法如下,添加特殊的字符串混合体（[name], [id] and [hash]）到输出文件名前

```js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry:'./src/app.js',
    output:{
        path: __dirname+"/dist",
        filename:'bundle_[hash:8].js'
    },
    module:{
        rules:[

            // 抽离css（如果是只有css）
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [require('autoprefixer')]
                            }
                        }
                    ]
                })

            },
            // 抽离less,并在link中引用
            {
                test:/\.less$/,
                use:ExtractTextPlugin.extract({
                    fallback:'style-loader',
                    use:[
                        'css-loader',
                        {
                            loader:'postcss-loader',
                            options:{
                                plugins: () => [require('autoprefixer')]
                            }
                        },
                        'less-loader'
                    ]
                })
            },
        ]
    },

    // 插件
    plugins:[
        // html模板插件
        new HtmlWebpackPlugin({
            template:'./src/index.ejs',
            filename:'index.html',
            title:'Webapck基础配置'
        }),

        // 抽离css
        new ExtractTextPlugin('style_[hash:8].css'),
    ]
}
```


参考：[ 入门webpack2.0](http://www.jianshu.com/p/42e11515c10f)