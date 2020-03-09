module.exports = {
  title: 'Documents',
  description: 'this is my docuemnts',
  themeConfig: {
    nav: [
      // {
      //   text: '首页',
      //   link: '/'
      // },
      {
        text: '基础',
        link: '/js/layout'
      },
      {
        text: 'Vue',
        link: '/vue/index'
      },
      {
        text: 'GitHub',
        link: 'https://github.com/luguanrui?tab=repositories'
      }
    ],
    sidebar: {
      '/js/': [
        {
          title: '基础',
          collapsable: false,
          children: [
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
      // '/vue/': [
      //   {
      //     title: 'Vue',
      //     collapsable: false,
      //     // children: [['questions', '问题']]
      //   }
      // ]
    }
  }
}
