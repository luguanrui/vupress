const moment = require('moment')

module.exports = {
  title: 'Documents',
  dest: 'dist',
  description: 'this is my docuemnts',
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  themeConfig: {
    lastUpdated: '上次更新',
    sidebarDepth: 0,
    nav: [
      // {
      //   text: '首页',
      //   link: '/'
      // },
      {
        text: '基础',
        link: '/base/html'
      },
      {
        text: 'Vue',
        link: '/vue/vue'
      },
      {
        text: 'Webpack',
        link: '/webpack/webpack'
      },
      {
        text: 'Typescript',
        link: '/typescript/typescript'
      },
      {
        text: 'Node',
        link: '/node/node'
      },
      {
        text: 'GitHub',
        link: 'https://github.com/luguanrui?tab=repositories'
      }
    ],
    sidebar: {
      '/base/': [
        {
          title: '基础',
          collapsable: false,
          children: [
            ['html', 'html相关'],
            ['layout', '页面布局'],
            ['css', 'css相关'],
            ['scope', '作用域和闭包'],
            ['dom', 'DOM事件'],
            ['prototype-chain', '原型链'],
            ['communications', '通信类'],
            ['http', 'HTTP'],
            ['safe', '安全类'],
            ['algorithm', '算法类'],
            ['change-this', 'call,apply和bind'],
            ['js-run', 'js运行机制'],
            ['page-performance', '页面性能'],
            ['error', '错误监控']
          ]
        }
      ],
      '/vue/': [
        {
          title: 'Vue',
          collapsable: false,
          children: [
            ['vue', 'vue'],
            ['vue-router', 'vue-router'],
            ['vuex', 'vuex']
          ]
        }
      ],
      '/webpack/': [
        {
          title: 'webpack',
          collapsable: false,
          children: []
        }
      ],
      '/typescript/': [
        {
          title: 'typescript',
          collapsable: false,
          children: []
        }
      ],
      '/node/': [
        {
          title: 'node',
          collapsable: false,
          children: []
        }
      ]
    }
  },
  plugins: [
    '@vuepress/medium-zoom',
    '@vuepress/back-to-top',
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    ]
  ]
}
