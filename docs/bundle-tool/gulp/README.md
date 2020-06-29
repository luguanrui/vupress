---
sidebar: auto
---

# Gulp

前端构建化工具（工程化式管理前端）
  
webpack、grunt、gulp（都基于nodejs）
- grunt：前端工程化的先驱
- gulp：更自然基于流的方式连接任务，Gulp基于nodejs中stream，效率更好语法更自然,不需要编写复杂的配置文件
- webpack：最年轻，擅长用于依赖管理，配置稍较复杂（webpack+npm）

自动化构建工具的作用：
	
- 压缩合并js/css
- 编译less、sass
- 批量压缩图片
- 模块化开发
- 单元测试
- 等等...

## api 

1. gulp.src(globs[, options])

1.1、说明：src方法是指定需要处理的源文件的路径，gulp借鉴了Unix操作系统的管道（pipe）思想，前一级的输出，直接变成后一级的输入，gulp.src返回当前文件流至可用插件；
 	
1.2、globs：需要处理的源文件匹配符路径。类型(必填)：String or StringArray；

通配符路径匹配示例：
- “src/a.js”：指定具体文件；
- “*”：匹配所有文件    例：src/*.js(包含src下的所有js文件)；
- “**”：匹配0个或多个子文件夹    例：src/**/*.js(包含src的0个或多个子文件夹下的js文件)；
- “{}”：匹配多个属性    例：src/{a,b}.js(包含a.js和b.js文件)  src/*.{jpg,png,gif}(src下的所有jpg/png/gif文件)；
- “!”：排除文件    例：!src/a.js(不包含src下的a.js文件)；

		var gulp = require('gulp'),
		    less = require('gulp-less');
		 
		gulp.task('testLess', function () {
		    //gulp.src('less/test/style.less')
		    gulp.src(['less/**/*.less','!less/{extend,page}/*.less'])
		        .pipe(less())
		        .pipe(gulp.dest('./css'));
		});
	1.3、options：  类型(可选)：Object，有3个属性buffer、read、base；

	(1) options.buffer：  类型：Boolean  默认：true 设置为false，将返回file.content的流并且不缓冲文件，处理大文件时非常有用；

	(2) options.read：  类型：Boolean  默认：true 设置false，将不执行读取文件操作，返回null；

	(3) options.base：  类型：String  设置输出路径以某个路径的某个组成部分为基础向后拼接，具体看下面示例：

		gulp.src('client/js/**/*.js') 
		  .pipe(minify())
		  .pipe(gulp.dest('build'));  // Writes 'build/somedir/somefile.js'
		 
		gulp.src('client/js/**/*.js', { base: 'client' })
		  .pipe(minify())
		  .pipe(gulp.dest('build'));  // Writes 'build/js/somedir/somefile.js'

1. **gulp.dest(path[, options])**

	2.1、说明：dest方法是指定处理完后文件输出的路径；
		
		gulp.src('./client/templates/*.jade')
		  .pipe(jade())
		  .pipe(gulp.dest('./build/templates'))
		  .pipe(minify())
		  .pipe(gulp.dest('./build/minified_templates'));

	2.2、path：  类型(必填)：String or Function 指定文件输出路径，或者定义函数返回文件输出路径亦可；

	2.3、options：  类型(可选)：Object，有2个属性cwd、mode；

	options.cwd：  类型：String  默认：process.cwd()：前脚本的工作目录的路径 当文件输出路径为相对路径将会用到；

	options.mode：  类型：String  默认：0777 指定被创建文件夹的权限；

3. **gulp.task(name[, deps], fn)**
	
	3.1、说明：task定义一个gulp任务；

	3.2、name：  类型(必填)：String 指定任务的名称（不应该有空格）；

	3.3、deps：  类型(可选)：StringArray，该任务依赖的任务（注意：被依赖的任务需要返回当前任务的事件流，请参看下面示例）；

		gulp.task('testLess', function () {
		    return gulp.src(['less/style.less'])
		        .pipe(less())
		        .pipe(gulp.dest('./css'));
		});
		 
		gulp.task('minicss', ['testLess'], function () { //执行完testLess任务后再执行minicss任务
		    gulp.src(['css/*.css'])
		        .pipe(minifyCss())
		        .pipe(gulp.dest('./dist/css'));
		});

	3.4、fn：  类型(必填)：Function 该任务调用的插件操作；

4. **gulp.watch(glob [, opts], tasks) or gulp.watch(glob [, opts, cb])**
	
	4.1、说明：watch方法是用于监听文件变化，文件一修改就会执行指定的任务；

	4.2、glob：  需要处理的源文件匹配符路径。类型(必填)：String or StringArray；

	4.3、opts：  类型(可选)：Object 具体参看https://github.com/shama/gaze；

	4.4、tasks：  类型(必填)：StringArray 需要执行的任务的名称数组；

	4.5、cb(event)：  类型(可选)：Function 每个文件变化执行的回调函数；

		gulp.task('watch1', function () {
		    gulp.watch('less/**/*.less', ['testLess']);
		});
		 
		gulp.task('watch2', function () {
		    gulp.watch('js/**/*.js', function (event) {
		        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		    });
		});	


# gulp相关插件

### 准备工作

* npm init （创建项目的package.json文件）
* npm install --global gulp  全局安装gulp
* npm install --save-dev gulp  作为项目的开发依赖（devDependencies）安装
* npm install (安装package.json中的插件)

> 全局安装了gulp，项目也安装了gulp，全局安装gulp是为了执行gulp任务，本地安装gulp则是为了调用gulp插件的功能。

## 匹配符  \*、\**、！、{}

	gulp.src('./js/*.js')               // * 匹配js文件夹下所有.js格式的文件
	gulp.src('./js/**/*.js')            // ** 匹配js文件夹的0个或多个子文件夹
	gulp.src(src/*.{jpg,png,gif})       //匹配src下的所有jpg/png/gif文件)；
	gulp.src(['./js/*.js','!./js/index.js'])    // ! 匹配除了index.js之外的所有js文件
	gulp.src('./js/**/{omui,common}.js')        // 匹配包含omui.js和common.js的文件

## 插件
	安装单个插件：
	 npm install –-save-dev gulp-uglify（或者简写为：npm i –D gulp-uglify）
	一次安装多个插件：
    npm install gulp-minify-css gulp-concat gulp-uglify gulp-rename del --save-dev
	删除安装的插件：
	npm uninstall gulp-uglify

1.	Gulp-uglify  （js压缩）
		
		var gulp = require('gulp'); //加载gulp	
		var uglify = require('gulp-uglify');//加载js压缩 	

		gulp.src('./hello.js')
		    .pipe(uglify())                 // 直接压缩hello.js
		    .pipe(gulp.dest('./dist'))
		    
		 gulp.src('./hello.js')
		    .pipe(uglify({
		        mangle: true,               // 是否修改变量名，默认为 true
		        compress: true,             // 是否完全压缩，默认为 true
		        preserveComments: 'all'     // 保留所有注释
		    }))
		    .pipe(gulp.dest('./dist'))


		// 定义一个任务 compass 	
		gulp.task('compass',function(){	
			gulp.src(['js/*.js','!js/*.min.js'])//获取文件，同时过滤掉.min.js文件	
	 		.pipe(uglify())
	 		.pipe(gulp.dest('javascript/')); //输出文件 
		}); 
	> 说明：第二个参数'！js/*.min.js'是用来过滤掉后缀为min.js，！感叹号为排除模式
 

2.	gulp-clean-css（CSS压缩） gulp-minify-css（已经弃用）
		
		var gulp = require('gulp');	
		var cleanCss = require('gulp-clean-css');	
		gulp.task('cssmini', function () {	
	    	gulp.src(['css/*.css', '!css/*.min.css'])  //要压缩的css	
	       	.pipe(cleanCss())	
	       	.pipe(gulp.dest('buildcss/'));	
		});

		var gulp = require('gulp');	
		var minify = require('gulp-minify-css');	
		gulp.task('cssmini', function () {	
	    	gulp.src(['css/*.css', '!css/*.min.css'])  //要压缩的css	
	       	.pipe(minify())	
	       	.pipe(gulp.dest('buildcss/'));	
		});

3.	gulp-concat（文件合并）合并CSS与JS文件，减少http请求。
	
		var gulp = require('gulp');	
		var concat = require("gulp-concat");

		gulp.src('./js/*.js')
		    .pipe(concat('all.js'))         // 合并js文件夹下的所用的.js文件，并命名为all.js文件
		    .pipe(gulp.dest('./dist'));
		    
		gulp.src(['./js/demo1.js','./js/demo2.js','./js/demo2.js'])
		    .pipe(concat('all.js'))         // 按照[]里的顺序合并文件
		    .pipe(gulp.dest('./dist'));
	
4.	gulp-less（编译Less） 把less文件转换为css，gulp-sass一样的用法（把scss文件转换为sass文件。）
	
		var gulp = require('gulp'),
		    less = require("gulp-less");
		gulp.task('compile-less', function () {
		    gulp.src('less/*.less')
		    .pipe(less())
		    .pipe(gulp.dest('dist/css'));
	
		});

5.	gulp-imagemin（压缩图片）可以使用gulp-imagemin的插件来压缩jpg、png、gif等图片

		var gulp = require('gulp');
		var imagemin = require('gulp-imagemin');
		var pngquant = require('imagemin-pngquant'); //png图片压缩插件
		
		gulp.task('default', function () {
		    return gulp.src('src/images/*')
		        .pipe(imagemin({
		            progressive: true,
		            use: [pngquant()] //使用pngquant来压缩png图片
		        }))
		        .pipe(gulp.dest('dist'));
		});



	> 说明：gulp-imagemin的使用比较复杂一点，它本身也有很多插件（更多imagemin插件），这里只是简单介绍一下，要想压缩不同格式的图片，必须对应安装不同的插件，这里只安装了pngquant插件。按照nodejs的模块化思想，每个require只包含一个功能，这样就可以达到按需加载的目的。

6.	gulp-livereload（自动刷新）

	当代码变化时，它可以帮助我们自动刷新页面，该插件最好配合谷歌浏览器，且要安装livereload chrome extension扩展插件，否则无效。

		var gulp = require('gulp'),
		    less = require('gulp-less'),
		    livereload = require('gulp-livereload');
		
		gulp.task('less', function() {
		  gulp.src('less/*.less')
		    .pipe(less())
		    .pipe(gulp.dest('css'))
		    .pipe(livereload());
		});
		
		gulp.task('watch', function() {
		  livereload.listen(); //要在这里调用listen()方法
		  gulp.watch('less/*.less', ['less']);  //监听目录下的文件，若文件发生变化，则调用less任务。
		});


7.	gulp-connect（启本地服务，同时可以自动刷新）	
	
	实现原理：通过在本地开启一个websocket服务，检测文件变化，当文件被修改后触发livereload任务，推送消息给浏览器刷新页面。

		var gulp = require('gulp'),
		    connect = require('gulp-connect');//本地服务	

		//本地服务配置
		var serverConfig={
		    root:'./dest/views',//项目的根目录
		    livereload: true,
		    port:8080
		};
		
		//创建任务
		gulp.task('server', function() {
		    connect.server(serverConfig);
		});

	> 或者使用nodeJS的serve
	>  
	> 安装：npm install serve -g
	>
	> 启动：serve . 

	> 说明：
	> 
	> 1.gulp启动任务后，可以看到终端显示在8080端口开启了一个http服务，而在****端口开启了LiveReload服务，实际为一个WebSocket服务。
	> 
	> 2.打开页面，可以看到原始页面中插入了livereload的js文件。
	> 
	> 3.在network中WS下可以看到WebSocket的消息。
	> 
	> 4.当编辑代码发生变化时（Ctrl＋S保存后），浏览器会收到消息，触发F5刷新页面的操作。
	
8.	gulp-zip （ZIP压缩文件）

		var zip = require('gulp-zip');
		
		gulp.src('./src/*')
		    .pipe(zip('all.zip'))                   // 压缩成all.zip文件
		    .pipe(gulp.dest('./dist'))

9.	gulp-autoprefixer （自动为css添加浏览器前缀）

	使用gulp-autoprefixer根据设置浏览器版本自动处理浏览器前缀。使用她我们可以很潇洒地写代码，不必考虑各浏览器兼容前缀。【特别是开发移动端页面时，就能充分体现它的优势。例如兼容性不太好的flex布局。】

		var autoprefixer = require('gulp-autoprefixer');
		
		gulp.src('./css/*.css')
		    .pipe(autoprefixer())                   // 直接添加前缀
		    .pipe(gulp.dest('dist'))
		
		gulp.src('./css/*.css')
		    .pipe(autoprefixer({
		        browsers: ['last 2 versions'],      // 浏览器版本
		        cascade：true                       // 美化属性，默认true
		        add: true                           // 是否添加前缀，默认true
		        remove: true                        // 删除过时前缀，默认true
		        flexbox: true                       // 为flexbox属性添加前缀，默认true
		    }))
		    .pipe(gulp.dest('./dist'))
	
	 > 说明: [案例](http://www.ydcss.com/archives/94)
	 >
	 > 配置项 browsers 参考 [浏览器列表](http://browserl.ist/)

10. gulp-sequence/run-sequence （解决task任务的同步执行）

	gulp的任务task都是异步执行的，如官方文档所述：默认的，task 将以最大的并发数执行，也就是说，gulp 会一次性运行所有的 task 并且不做任何等待，那么假如我们需要同步的话应该怎么做，官方文档也有提及，下面我们使用插件来实现
	
	例如：进行一个工程的样式文件进行发布，先对scss进行编译，然后对里面的图片合并为雪碧图，最后在对处理好的css进行合并压缩。

		编译scss的任务
		gulp.task( 'spriteScss', function( cb ) {
		    var src = [];
		    src.push( cssSrc + "home/" + projectModule + '/**/*.scss' );
		
		    return gulp.src( src )
		        .pipe( sass().on( 'error', sass.logError ) )
		        .pipe( gulp.dest( 'spriteScss' ) );
		} );

		合并样式文件
		gulp.task( 'spriteCss', function( cb ) {
		    var src = [];
		    src.push( 'spriteScss/**/*.css' );
		    //- 创建一个名为 concat 的 task
		    return gulp.src( src )
		        //- 合并后的文件名
		        .pipe( concat( projectModule + '.css' ) )
		        .pipe( replace( /\(images\//g, '(../spriteImg/' ) )
		        //- 输出文件本地
		        .pipe( gulp.dest( 'spriteCss' ) );
		} );

		生成雪碧图
		gulp.task( 'spriteDest', function( cb ) {
		    return gulp.src( 'spriteCss/' + projectModule + '.css' )
		        .pipe( cssSprite( {
		            // sprite背景图源文件夹，只有匹配此路径才会处理
		            imagepath: 'spriteImg/',
		            // 映射CSS中背景路径，支持函数和数组，默认为 null
		            imagepath_map: null,
		            // 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
		            spritedest: 'spriteImg/',
		            // 替换后的背景路径，默认 ../images/
		            spritepath: '../images/' + projectModule + '/',
		            // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
		            padding: 2,
		            // 是否使用 image-set 作为2x图片实现，默认不使用
		            useimageset: false,
		            // 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
		            newsprite: mode === "release", //判断是否发布模式，是就建以时间戳为文件名的文件，否则不建。
		            // 给雪碧图追加时间戳，默认不追加
		            spritestamp: false,
		            // 在CSS文件末尾追加时间戳，默认不追加
		            cssstamp: false
		        } ) )
		        .pipe( gulp.dest( 'spriteDest/' ) );
		} );

		使用控件gulp-sequence
		gulp.task( 'css', gulpSequence( 'spriteScss', 'spriteCss', 'spriteDest', function() {
		    console.log( "输出完成！" );
		} ) );



11. gulp-htmlmin（压缩html）

	压缩html中的css，js
	
		var gulp = require('gulp');
		var htmlmin = require('gulp-htmlmin');
		
		gulp.task('minify', function() {
		    gulp.src('src/*.html')
		        .pipe(htmlmin({collapseWhitespace: true}))
		        .pipe(gulp.dest('dist'));
		});


12. gulp-clean（删除文件或文件夹）

	当你需要清空缓存文件夹时，或由于某个目的需要清除一些文件时，可以用gulp-clean。

		var gulp = require('gulp');
		var clean = require('gulp-clean');
		
		gulp.task('default', function () {
		    gulp.src('app/tmp', {read: false})
		        .pipe(clean());
		});


13. 复制第三方插件（不需要插件）
		
		//复制第三方插件
		gulp.task('copy',function () {
		    gulp.src(src_plugins+'/**/*')
		        .pipe(gulp.dest(dest_plugins))
		});
