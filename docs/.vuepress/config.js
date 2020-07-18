const dayjs = require("dayjs");

module.exports = {
  title: "Blog",
  base: "/",
  dest: "dist",
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  themeConfig: {
    displayAllHeaders: true,
    lastUpdated: "上次更新",
    sidebarDepth: 3, // 1
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
              { text: "v2", link: "/frame/vue/v2/" },
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
          {
            text: "Webpack",
            link: "/bundle-tool/webpack/",
            items: [
              {
                text: "v2",
                link: "/bundle-tool/webpack/v2",
              },
              {
                text: "v4",
                link: "/bundle-tool/webpack/v4",
              },
            ],
          },
          { text: "Rollup", link: "/bundle-tool/rollup/" },
          { text: "Gulp", link: "/bundle-tool/gulp/" },
        ],
      },
      {
        text: "分享",
        link: "/share/",
      },
      {
        text: "工具函数",
        link: "https://github.com/luguanrui/utils-library",
      },
      {
        text: "GitHub",
        link: "https://github.com/luguanrui?tab=repositories",
      },
    ],
    sidebar: {
      "/base/": [
        ["", "目录"],
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
      "/share/": [
        ["", "目录"],
        "vue-lazyload",
        "date",
        "dynamic-table",
        "auto-deploy",
        "word-wrap",
        "scrollInto-view",
        "cupping",
        "keep-alive",
        "pagination-and-interaction",
        "parseInt",
        "hexo",
        "vertical-and-middle",
        "1px",
        "dy-dialog"
      ],
      "/frame/vue/v2/": [["", "目录"], "reactive","render", "extend"],
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
