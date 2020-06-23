const dayjs = require("dayjs");

module.exports = {
  title: "Blog",
  base: "/",
  dest: "dist",
  description: "个人博客",
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  themeConfig: {
    displayAllHeaders: true,
    lastUpdated: "上次更新",
    sidebarDepth: 2,
    nav: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "基础",
        link: "/base/",
      },
      {
        text: "框架",
        items: [
          {
            text: "Vue",
            items: [
              { text: "Vue2.0", link: "/frame/vue/vue2/" },
              { text: "Vuex", link: "/frame/vue/vuex/" },
              { text: "VueRouter", link: "/frame/vue/vue-router/" },
            ],
          },
          {
            text: "React",
            items: [
              { text: "React", link: "/frame/react/react/" },
              { text: "ReactRouter", link: "/frame/react/react-router/" },
              { text: "Redux", link: "/frame/react/redux/" },
            ],
          },
        ],
      },
      {
        text: "打包工具",
        items: [
          {text: 'Webpack', link: '/bundle-tool/webpack/'},
          {text: 'Rollup', link: '/bundle-tool/rollup/'}
        ]
      },
      {
        text: "GitHub",
        link: "https://github.com/luguanrui?tab=repositories",
      },
    ],
    sidebar: {
      "/base/": [
        ['', '目录'],
        "html",
        "layout",
        "css",
        "scope",
        "dom",
        "prototype-chain",
        "communications",
        "http",
        "safe",
        "algorithm",
        "event-loop",
        "page-performance",
        "error",
        "change-this",
        "debounce-throttle",
        "es6",
      ],
      '/frame/vue/vue2/': [
        ['', 'vue2.0'],
        'render',
        'reactive',
        'extend'
      ]
    },
  },
  plugins: [
    "@vuepress/medium-zoom",
    "@vuepress/back-to-top",
    [
      "@vuepress/last-updated",
      {
        transformer: (timestamp, lang) => {
          return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
        },
      },
    ],
  ],
};
