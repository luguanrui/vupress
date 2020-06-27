# hexo

记录使用hexo + GithubPages搭建自己的博客的过程

## 前提

- 使用hexo脚手架，是基于nodejs的
- 服务器使用GitHub Pages，免费提供300M的空间
- 最重要的是不需要后台，不需要后台，不需要后台！

## 搭建过程

1. 简单几条命令行搭建项目框架

使用hexo来安装，详细的文档请参考[官网](https://hexo.io/zh-cn/docs/)

安装hexo
```bash
npm install -g hexo-cli
```
检查是否安装成功
```bash
hexo -v
```

初始化项目,如果在当前文件夹下初始化，可以不写blog,但是要保证这个文件夹是个空文件夹
```bash
hexo init <blog>
```

安装相关的依赖，使用过的nodejs的同学懂得
```bash
npm install
```

到此，我们的项目架构已经搭建好了，可以执行下面的命令在本地跑起来看看
```bash
hexo server (或者简写 hexo s)
```

2. 自选主题themes

这个时候，有人可能要说了，这个样式是也太好（zhen）看（chou）了点吧！对的，hexo的另一个强大之处就是有很多的套餐供你选择，妈妈再也不用担心你的博客样式太丑了。[狂戳这里查看主题](https://hexo.io/themes/)

为了照顾哪些有选择恐惧症的同学，博主推荐一个自己用的主题[material](https://github.com/viosey/hexo-theme-material),同是带领大家用这个themes搞点事情，说到这，有些童鞋已经按耐不住自己体内的洪荒之力了，想要赶快动手去down下来这个主题去试试了，好了，不**（关键字被和谐了）了，下面我们开始去搞事情了

3. 使用material，真的不要太简单哦

三步走：

- 首先打开“冰箱门”：下载最稳定版本的material，点击github最显眼的绿色clone or download即可下载，或者使用git clone下来
- 然后“将大象装进冰箱”：将下载下来的文件解压，重新命名为material，并将文件_config.template.yml更名为_config.yml(注意区分最后一步的_config.yml,不是同一个路径下的)，并copy到我们一通命令行下来的项目中的themes文件下
- 最后关上“冰箱门”：打开项目根目录下的_config.yml文件，找到theme，将值替换为material，这个时候，重新启动服务`hexo server`即可看到你已经把这个主题copy下来

4. 怎么使用GithubPages

如果使用过github的同学，就跟
创建仓库一样，过程如下：

- 打开github，输入账号username，密码password
- 点击Repositories，之后你会看到一个绿色的按钮new，对，又是绿色的
- 在Repository name框中输入内容格式：username.github.io
- 点击绿色按钮Creating repository，如果成功了，恭喜你，你距离成功又近了一步！

5. 如何将github的域名链接到你的域名

- 购买域名，解析为CNAME
- 在source下创建CNAME文件，不需要后缀，里面加上你的域名 www.xxxxx.com

6. 创建页面
```bash
hexo new <name>
```
7. 打包
```bash
hexo g
```
8. 发布
```bash
hexo d 
```