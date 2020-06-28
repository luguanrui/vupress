# 自动部署

## 业务场景

- 在公司没有Jenkins等部署工具的时候
- 需要我们自己每次手动去部署，打包，压缩，上传，解压等工作很繁琐
- 因此需要一个自动发布的来帮助我们解决这些繁琐的工作

## 准备工作

查阅资料，参考：[ssh2实现vue项目自动化打包发布](https://www.jianshu.com/p/d78e4898824f)这篇文章

1. linux服务器解压文件到指定的文件夹：

```bash
unzip update.zip -d update
```

2. 相关插件

- [ssh2](https://github.com/mscdex/ssh2)：连接客户端和服务端的工具
- [archier](https://github.com/archiverjs/node-archiver)：用于生成文档的流接口
- [chalk](https://github.com/chalk/chalk)：node终端样式库

## 技术实现

package.json 

```bash
scripts: {
    deploy: "node deploy/deploy.js"
}
```

参数配置：

```js
// config.js
var config = {
  host: "***", // 服务器ip
  username: "***", // 用户名
  password: "***", // 密码
  port: 22, // 端口号（默认22）
  remotePath: "/web" // 服务存放前端资源的目录
};
module.exports = config;
```

部署工作：
```js
// deploy.js
const fs = require("fs");
const archiver = require("archiver");
const chalk = require("chalk");
const Client = require("ssh2").Client;
const conn = new Client();
const config = require("./config");

const { host, username, password, port, remotePath } = config;

const fileName = "dist"; // 本地文以及服务服务器文件,可根据环境变量进行配置
const localFilePath = `./${fileName}.zip`; // 本地压缩后的文件

// 压缩文件
function compress() {
  const output = fs.createWriteStream(localFilePath); // 创建一个可写流 **.zip
  const archive = archiver("zip"); // 生成archiver对象，打包类型为zip
  archive.pipe(output); // 将存档数据管道化到文件
  archive.glob(`./${fileName}/**`); // 追加与匹配到的文件
  archive.finalize(); // 完成打包,“close”、“end”或“finish”可能在调用此方法后立即被激发
  output.on("close", () => {
    console.log(chalk.green("compress finished, waiting for upload..."));
    ready(); // 上传
  });
}

const cmdList = [
  `cd ${remotePath}\n`,
  `rm -rf ${fileName}.copy\n`,
  `mv ${fileName} ${fileName}.copy\n`,
  `unzip ${fileName}.zip\n`,
  `rm -rf ${fileName}.zip\n`,
  `exit\n`
];

/**
 * 上传文件
 * @param conn
 */
function uploadFile(conn) {
  const remoteFilePath = `${remotePath}/${fileName}.zip`; // 远程文件路径
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastPut(localFilePath, remoteFilePath, {}, (err, result) => {
      if (err) {
        console.log(chalk.red(err.message));
        throw err;
      }
      shell(conn);
    });
  });
}

/**
 * 上传完成后服务器需要执行的内容
 * 删除本地压缩文件
 * @param conn
 * @constructor
 */
function shell(conn) {
  conn.shell((err, stream) => {
    if (err) throw err;
    stream
      .on("close", function() {
        console.log("Stream :: close");
        conn.end();
        fs.unlinkSync(localFilePath);
      })
      .on("data", function(data) {
        console.log("OUTPUT: " + data);
      });
    stream.end(cmdList.join(""));
  });
}

function ready() {
  conn
    .on("ready", () => {
      console.log("Client :: ready");
      uploadFile(conn);
    })
    .connect({ host, username, password, port });
}

compress();

```

缺点：
- 暴露了服务器的密码，有安全隐患
- 需要先本地打包，然后在执行`npm run deploy`，部署完成之后需要手动删除本地的包