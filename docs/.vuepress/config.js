const dayjs = require('dayjs')

module.exports = {
  title: 'Blog',
  base: '/',
  dest: 'dist',
  description: 'this is my blog',
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  themeConfig: {
    displayAllHeaders: true,
    lastUpdated: '上次更新',
    sidebarDepth: 2,
    nav: [
      // {
      //   text: '首页',
      //   link: '/'
      // },
      {
        text: '基础',
        link: '/base/',
      },
      {
        text: 'Vue',
        link: '/vue/'
      },
      {
        text: 'Webpack',
        link: '/webpack/',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/luguanrui?tab=repositories',
      },
    ],
    sidebar: {
      '/base/': [
        'html',
        'layout',
        'css',
        'scope',
        'dom',
        'prototype-chain',
        'communications',
        'http',
        'safe',
        'algorithm',
        'js-run',
        'page-performance',
        'error',
        'change-this',
        'debounce-throttle',
        'es6'
      ],
      '/vue/': [
        'vue',
        'vue-router',
        'vuex'
      ],
      'webpack': [
        'README'
      ]
    },
    // sidebar: {
    //   '/base/': [
    //     {
    //       title: '基础',
    //       collapsable: false,
    //       children: [
    //         ['html', 'html相关'],
    //         ['layout', '页面布局'],
    //         ['css', 'css相关'],
    //         ['scope', '作用域和闭包'],
    //         ['dom', 'DOM事件'],
    //         ['prototype-chain', '原型链'],
    //         ['communications', '通信类'],
    //         ['http', 'HTTP'],
    //         ['safe', '安全类'],
    //         ['algorithm', '算法类'],
    //         ['js-run', 'js运行机制'],
    //         ['page-performance', '页面性能'],
    //         ['error', '错误监控'],
    //         ['change-this', '改变this执行'],
    //         ['debounce-throttle', '防抖和节流'],
    //         ['es6', 'es6']
    //       ]
    //     }
    //   ],
    //   '/vue/': [
    //     {
    //       title: 'Vue',
    //       collapsable: false,
    //       children: [
    //         ['vue', 'vue'],
    //         ['vue-router', 'vue-router'],
    //         ['vuex', 'vuex']
    //       ]
    //     }
    //   ],
    //   '/webpack/': [
    //     {
    //       title: 'webpack',
    //       collapsable: false,
    //       children: [
    //         ['webpack', 'webpack']
    //       ]
    //     }
    //   ],
    //   '/typescript/': [
    //     {
    //       title: 'typescript',
    //       collapsable: false,
    //       children: []
    //     }
    //   ],
    //   '/node/': [
    //     {
    //       title: 'node',
    //       collapsable: false,
    //       children: []
    //     }
    //   ]
    // }
  },
  plugins: [
    '@vuepress/medium-zoom',
    '@vuepress/back-to-top',
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
        },
      },
    ],
  ],
}
