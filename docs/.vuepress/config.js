const moment = require('moment')

module.exports = {
  title: 'Documents',
  description: 'this is my docuemnts',
  themeConfig: {
    lastUpdated: '上次更新',
    sidebarDepth: 0,
    head: [
      ['link', { rel: 'icon', href: '/public/logo.png' }]
    ],
    nav: [
      // {
      //   text: '首页',
      //   link: '/'
      // },
      {
        text: '基础',
        link: '/base/layout'
      },
      {
        text: 'Vue',
        link: '/vue/vue'
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
            ['html', 'html'],
            ['layout', '页面布局'],
            ['css', 'CSS盒模型'],
            ['scope', '作用域和闭包'],
            ['dom', 'DOM事件'],
            ['prototype', '原型链'],
            ['communications', '通信类'],
            ['http', 'HTTP'],
            ['safe', '安全类'],
            ['algorithm', '算法类']
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
      ]
    }
  },
  plugins: [
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
