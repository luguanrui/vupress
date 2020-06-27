---
sidebar: auto
---

# Rollup

记录在vue源码阅读过程中，rollup打包工具的使用及实现，拥有一款属于自己的[前端工具函数库](https://github.com/luguanrui/utils-library)，从此走上人生巅峰

## vue中rollup的实现

### 别名配置
scripts/alias.js文件：

```js
const path = require('path')

// 路径合并
// __dirname: 前文件所在的目录的绝对路径
// console.log(__dirname) //  /Users/lujing/demo/vue/scripts
// path.resolve() 生成绝对路径

const resolve = p => path.resolve(__dirname, '../', p)

module.exports = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'), // export default Vue
  compiler: resolve('src/compiler'), // 模板解析的相关文件,      export const createCompiler(){}
  core: resolve('src/core'),// 核心代码                         export default Vue
  shared: resolve('src/shared'),// 共享的工具方法
  web: resolve('src/platforms/web'),//  web平台，相关的内容
  weex: resolve('src/platforms/weex'), // 客户端平台，weex端独有文件
  server: resolve('src/server'), // 服务端渲染相关
  entries: resolve('src/entries'), // 入口文件
  sfc: resolve('src/sfc') // .vue文件解析，.vue 文件内容解析成一个 JavaScript 的对象。  export function parseComponent(){}
}
/**
 * {
 *  vue: '/Users/lujing/demo/vue/src/platforms/web/entry-runtime-with-compiler'
 *  compiler: /Users/lujing/demo/vue/src/compiler
 *  core: /Users/lujing/demo/vue/src/core
 *  shared: /Users/lujing/demo/vue/src/shared
 *  web: /Users/lujing/demo/vue/src/platforms/web
 *  weex: /Users/lujing/demo/vue/src/platforms/weex
 *  server: /Users/lujing/demo/vue/src/server
 *  entries: '/Users/lujing/demo/vue/src/entries',
 *  sfc:/Users/lujing/demo/vue/src/sfc
 * }
 */

```

### 参数配置

scripts/config.js

```js
// rollup配置文件

// 引入相关的插件
const path = require('path')
const buble = require('rollup-plugin-buble')
const alias = require('rollup-plugin-alias')
const cjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const node = require('rollup-plugin-node-resolve')
const flow = require('rollup-plugin-flow-no-whitespace')
const version = process.env.VERSION || require('../package.json').version
const weexVersion = process.env.WEEX_VERSION || require('../packages/weex-vue-framework/package.json').version

// 定义banner
const banner =
  '/*!\n' +
  ` * Vue.js v${version}\n` +
  ` * (c) 2014-${new Date().getFullYear()} Evan You\n` +
  ' * Released under the MIT License.\n' +
  ' */'

// 定义weexFactoryPlugin，使用在rollup的plugins中
const weexFactoryPlugin = {
  intro () {
    return 'module.exports = function weexFactory (exports, document) {'
  },
  outro () {
    return '}'
  }
}

// 引入别名alias配置文件
const aliases = require('./alias')

// 定义打包文件的入口和出口地址
/*
  参数p以 / 做字符串分割，取数组的第一个值，
 (1) 如果为aliases对象的key，则拼接key对应的value值 和 参数p第一个/后面的地址,生成一个绝对地址，
     比如,resolve('web/entry-runtime.js'),返回：/Users/lujing/demo/vue/src/platforms/web/entry-runtime.js
 (2) 否则，/Users/lujing/demo/vue/src与p拼接生成一个绝对路径
     比如，resolve('dist/vue.runtime.common.js'),返回：/Users/lujing/demo/vue/dist/vue.runtime.common.js
*/

const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}

// 定义多种伪rollup打包的配置项,共构建三种文件模式，cjs,umd,es
/*
  entry：构建的入口js文件
  dest：构建成功的出门文件地址以及文件名
  format： 构建的格式
  banner,
  alias,
  env,
  moduleName,
  plugins,
  external,
  weex
*/
const builds = {
  // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
  'web-runtime-cjs': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.common.js'),
    format: 'cjs',
    banner
  },
  // Runtime+compiler CommonJS build (CommonJS)
  'web-full-cjs': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.common.js'),
    format: 'cjs',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime only (ES Modules). Used by bundlers that support ES Modules,
  // e.g. Rollup & Webpack 2
  'web-runtime-esm': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.esm.js'),
    format: 'es',
    banner
  },
  // Runtime+compiler CommonJS build (ES Modules)
  'web-full-esm': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.esm.js'),
    format: 'es',
    alias: { he: './entity-decoder' },
    banner
  },
  // runtime-only build (Browser)
  'web-runtime-dev': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.js'),
    format: 'umd',
    env: 'development',
    banner
  },
  // runtime-only production build (Browser)
  'web-runtime-prod': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.min.js'),
    format: 'umd',
    env: 'production',
    banner
  },
  // Runtime+compiler development build (Browser)
  'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime+compiler production build  (Browser)
  'web-full-prod': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.min.js'),
    format: 'umd',
    env: 'production',
    alias: { he: './entity-decoder' },
    banner
  },
  // Web compiler (CommonJS).
  'web-compiler': {
    entry: resolve('web/entry-compiler.js'),
    dest: resolve('packages/vue-template-compiler/build.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-template-compiler/package.json').dependencies)
  },
  // Web compiler (UMD for in-browser use).
  'web-compiler-browser': {
    entry: resolve('web/entry-compiler.js'),
    dest: resolve('packages/vue-template-compiler/browser.js'),
    format: 'umd',
    env: 'development',
    moduleName: 'VueTemplateCompiler',
    plugins: [node(), cjs()]
  },
  // Web server renderer (CommonJS).
  'web-server-renderer': {
    entry: resolve('web/entry-server-renderer.js'),
    dest: resolve('packages/vue-server-renderer/build.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  'web-server-renderer-basic': {
    entry: resolve('web/entry-server-basic-renderer.js'),
    dest: resolve('packages/vue-server-renderer/basic.js'),
    format: 'umd',
    env: 'development',
    moduleName: 'renderVueComponentToString',
    plugins: [node(), cjs()]
  },
  'web-server-renderer-webpack-server-plugin': {
    entry: resolve('server/webpack-plugin/server.js'),
    dest: resolve('packages/vue-server-renderer/server-plugin.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  'web-server-renderer-webpack-client-plugin': {
    entry: resolve('server/webpack-plugin/client.js'),
    dest: resolve('packages/vue-server-renderer/client-plugin.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  // Weex runtime factory
  'weex-factory': {
    weex: true,
    entry: resolve('weex/entry-runtime-factory.js'),
    dest: resolve('packages/weex-vue-framework/factory.js'),
    format: 'cjs',
    plugins: [weexFactoryPlugin]
  },
  // Weex runtime framework (CommonJS).
  'weex-framework': {
    weex: true,
    entry: resolve('weex/entry-framework.js'),
    dest: resolve('packages/weex-vue-framework/index.js'),
    format: 'cjs'
  },
  // Weex compiler (CommonJS). Used by Weex's Webpack loader.
  'weex-compiler': {
    weex: true,
    entry: resolve('weex/entry-compiler.js'),
    dest: resolve('packages/weex-template-compiler/build.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/weex-template-compiler/package.json').dependencies)
  }
}

//
/**
 * 定义rollup真正的参数
 * name为对象builds的key
 */
function genConfig (name) {

  // 获取的builds中的某个对象
  const opts = builds[name]

  // 定义真rollup的配置参数
  const config = {

    // 入口
    input: opts.entry,

    //指出应将哪些模块视为外部模块，接受一个模块名称的数组或一个接受模块名称的函数，不会被打包导入
    external: opts.external,

    /**
     * 插件
     * 1、rollup-plugin-replace插件的用途是在打包时动态替换代码中的内容,如：将 __WEEX__ 替换为 !!opts.weex
     * 2、rollup-plugin-flow-no-whitespace去除flow静态类型检查代码, /* @flow *\/ 被修改为了 /* *\/,要去掉注释还得使用terser
     * 3、rollup-plugin-buble将ES6+代码编译成ES2015标准
     * 4、rollup-plugin-aliasalias插件提供了为模块起别名的功能
     *
     */
    plugins: [
      replace({
        __WEEX__: !!opts.weex,
        __WEEX_VERSION__: weexVersion,
        __VERSION__: version
      }),
      flow(),
      buble(),
      alias(Object.assign({}, aliases, opts.alias))
    ].concat(opts.plugins || []),

    // 出口
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'Vue'
    },

    // 额外选项，将拦截警告信息
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  // config的plugins中替换环境变量
  if (opts.env) {
    config.plugins.push(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  // 定义数据描述符，config对象中新增 _name，并且是可选值，值为函数的参数 name
  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })

  return config
}

/**
 * 如果 process.env.TARGET 存在，则直接返回genConfig
 * 否则返回两个函数 getBuild = genConfig , getAllBuilds
 * Object.keys(builds) 返回 builds 对象的 keys 组成的数组，然后再遍历这个数组，返回config数组
 */
if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET)
} else {
  exports.getBuild = genConfig
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}


/*
console.log(genConfig('web-full-dev'))返回一个对象

{ input:
  '/Users/lujing/demo/vue/src/platforms/web/entry-runtime-with-compiler.js',
 external: undefined,
 plugins:
  [ { name: 'replace', transform: [Function: transform] },
    { name: 'flow-remove-types', transform: [Function: transform] },
    { name: 'buble', transform: [Function: transform] },
    { resolveId: [Function: resolveId] },
    { name: 'replace', transform: [Function: transform] } ],
 output:
  { file: '/Users/lujing/demo/vue/dist/vue.js',
    format: 'umd',
    banner:
     '/*!\n * Vue.js v2.5.21\n * (c) 2014-2018 Evan You\n * Released under the MIT License.\n *\/',
    name: 'Vue' },
 onwarn: [Function: onwarn] }
 */

```

### 打包配置

scripts/build.js

```js
// 引入相关插件
const fs = require('fs')
const path = require('path')
const zlib = require('zlib') // Node.js内置模块，用于使用gzip算法进行文件压缩
const rollup = require('rollup')
const terser = require('terser') //  Node.js内置模块,代码最小化打包代码压缩，取代uglify，支持ES模块,rollup-plugin-uglify：代码压缩（不支持ES模块）；

/**
 * 同步判断，如果dist文件不存在，则生成dist文件
 * existsSync以同步的方法检测目录是否存在
 */
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

// 从配置文件config中读取参数配置,并执行函数getAllBuilds(),返回参数配置数组对象
let builds = require('./config').getAllBuilds()

// filter builds via command line arg
if (process.argv[2]) {
  const filters = process.argv[2].split(',')
  builds = builds.filter(b => {
    return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
  })
} else {
  // filter out weex builds by default
  builds = builds.filter(b => {
    return b.output.file.indexOf('weex') === -1
  })
}

// 构建打包
build(builds)

/**
 * 定义构建打包
 * 参数 builds 数组
 */
function build (builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }

  next()
}


/**
 * 打包入口
 * 参数为 builds数组中的每一项config
 */
function buildEntry (config) {
  const output = config.output // 文件出口
  const { file, banner } = output
  const isProd = /min\.js$/.test(file) // 匹配min.js结尾的文件
  //  rollup的提供的JavaScript aip ，rollup.rollup 函数返回一个 Promise
  return rollup.rollup(config)
    .then(bundle => bundle.generate(output))  // bundle.generate(output)生成code源码和map
    .then(({ code }) => {
      if (isProd) { // 如果文件是min则再次压缩文件并写入banner
        const minified = (banner ? banner + '\n' : '') + terser.minify(code, {
          output: {
            ascii_only: true
          },
          compress: {
            pure_funcs: ['makeMap']
          }
        }).code
        return write(file, minified, true)
      } else {
        return write(file, code)
      }
    })
}


/**
 * 写入文件的封装函数
 * dest：输出文件的绝对路径，通过output.file获取；
 * code：源码字符串，通过bundle.generate()获取；
 * zip：是否需要进行gzip压缩测试，如果isProd为true，则zip为true，反之为false。
 */
function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    /**
     * 输出日志函数
     * path.relative(process.cwd(), dest)：获取当前命令行路径到最终生成文件的相对路径
     * blue()：函数生成命令行蓝色的文本
     * getSize(code) ：获取文件容量
     *
     */
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    /**
     * fs.writeFile异步写入
     * 三个参数 dest，code，以及回调函数
     *
     */
    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) { // 如果zip存在，则使用zlib的gzip压缩
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}
// 获取源码的大写
function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}
/**
 * 打印错误日志
 */
function logError (e) {
  console.log(e)
}

/**
 * 使Node.js中的console.log()输出彩色字体
 */
function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

```
