module.exports = {
  title: 'Documents',
  description: 'this is my docuemnts',
  themeConfig: {
    nav: [
      {
        text: '首页',
        link: '/'
      },
      {
        text: '基础',
        items: [
          { text: '页面布局', link: '/js/layout/' },
          { text: 'CSS盒模型', link: '/js/css/' },
          { text: '作用域和闭包', link: '/js/scope/' },
          { text: 'DOM事件', link: '/js/dom/' },
          { text: '原型链', link: '/js/prototype/' },
          { text: '通信类', link: '/js/communications/' },
          { text: 'HTTP', link: '/js/http/' },
          { text: '安全类', link: '/js/safe/' },
          { text: '算法类', link: '/js/algorithm/' }
        ]
      },
      {
          text: 'vue',
          link: '/vue/questions.vue'
      },
      {
        text: 'GitHub',
        link: 'https://github.com/luguanrui?tab=repositories'
      }
    ]
  }
}
