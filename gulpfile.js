/*
 * @Author: TimLie.yaoleixia
 * @Date: 2018-05-24 13:11:16
 * @LastEditors: TimLie.yaoleixia
 * @LastEditTime: 2018-05-24 19:45:35
 * @Description: gulp构建
 * @Email: yaolx@csdn.net
 * @Company: CSDN
 * @GitHub: https://github.com/TimYao
 * @version: 1.0.0
 *
 * 支持：
 *    命令启动版本: node v6.3.1  npm v3.10.3
 *    构建环境: development(dev) / production(pro)
 *    构建命令: [NODE_ENV] npm start  - dev
 *             [NODE_ENV] npm run build  - pro
 *             [NODE_ENV]  - 可选择命令，环境提供,默认development
 *
 *    构建版本:
 *             npm start -- -v/--v versionNumber{number}
 *
 *    删除版本:
 *            npm run clean:all (默认删除更新构建版本,已提供命令删除所有版本)
 */

 /*
   问题一： 目录构建流程添加 自动创建版本目录（1）命令支持
   问题二： sourcemap 路径问题（2） ok 待解决
   问题三： 文件消息流展示 查看了解相关文档后期解决
   问题四： 图片编译配置（了解文档）图片是否考虑生成sprite模式 待续后中
   问题五： stylus 添加 build压缩 重命名（4）ok
   问题六： es6配置（5）待续后中
   问题7： stylue css规则问题
   问题8： es6编译检测（7）待续后中
   问题9： 错误处理消息功能（8）ok
   问题10：环境支持参量问题考虑  ok
   问题11：增加检测变化文件编译 待解决
   问题12：browserlist配置问题 待解决
   问题13：如何快速引入模块文件
 */


/**
 *  引入定义
 */
const fs = require('fs');
const Q = require('q');
const through2 = require('through2');
const runSequence = require('run-sequence');
const del = require('del');
const autoprefixer = require('autoprefixer');
const ifElse = require('gulp-if-else');
const gulp = require('gulp');
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const stylus = require('gulp-stylus');
const eslint = require('gulp-eslint');
const csslint = require('gulp-csslint');
const postcss = require('gulp-postcss');
const fontmin = require('gulp-fontmin');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const cssmin = require('gulp-cssmin');
const concat = require('gulp-concat');
const mergeStream = require('merge-stream');
const plumber = require('gulp-plumber');



/*****  基本参量定义  *****/

/**
 * aid parameter define
 *
 * @name {boolean} ci              -- ci控制错误信息流程变量
 */
let ci = false;

/**
 * 正则定义
 */
const REGS = {
  regVer: /(\-)+(v|version)/g,    // 版本正则
  regDir: /(\-)+(c|create)/g,     // 创建正则
  regVersion: /^(\d+)(\.\d+)*$/   // 版本号
}

/**
 * 命令支持
 */
const COMMANDS = {
  'v':true,
  'version': true,
  'c':true,
  'create': true
}

/**
 * init env
 *
 * @name {object} ENVPARAMS              -- env infos
 * @name {object} ENVPARAMS.Env          -- 控制环境变量  目前只提供development/production
 * @name {string} ENVPARAMS.env          -- define env
 * @name {string} ENVPARAMS.version      -- compiled dir version
 * @name {string} ENVPARAMS.latest       -- 最新版本记录
 * @name {object[]} tasks                -- 指派执行的任务
 */
const ENVPARAMS = {
  Env:{
    dev: process.env.NODE_ENV && ((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') && 'development') || 'development',
    pro: process.env.NODE_ENV && ((process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'pro') && 'production') || 'production'
  },
  env: process.env.NODE_ENV || 'development',
  version: '1.0.0',
  latest: '1.0.0',
  tasks:[]
};
// 重置保证环境变量范围
ENVPARAMS.env = ENVPARAMS.Env[ENVPARAMS.env] || 'development';


/**
 * INFOS define
 *
 * @name {object} INFOS                    -- print message
 * @param {string} INFOS.commandInfoMess   -- command message
 * @param {string} INFOS.dirVersionInfos   -- dir list message
 */
const INFOS = {
  commandInfoMess: `\n构建命令: \n
                    npm run <command> -- [-- <args>]\n
                      <command>:  [start, build]\n
                    npm start/build -- --v/-version number\n
                      default: 1.0.0
                   `,
  dirVersionInfos: (files) => {
    let infoMessage;
    // print info
    files = files.map((a, b) => {
      return `version: ${a}`;
    });
    files = files.join('\n  ')
    infoMessage = INFOS.commandInfoMess + `\n目前版本: \n\n  ${files}\n`;
    return infoMessage;
  },
  streamInfo: ``,
  cleanInfo: `清楚dist目录完成！
             `
}


/**
 *  stand by ext
 */
let FILEEXT = {
  stylus: '.styl',
  es6: '.js',
  images: '.{jp?(e)g,gif,svg,png}',
  fonts: '.{eot,svg,ttf,otf,woff?(2)}'
}

/**
 * path define
 *
 * @name {object} Path
 * @name {string} Path.root        -- 静态资源目录
 * @name {string} Path.dist        -- 构建生成目录
 * @name {string} Path.ui          -- ui组件根目录
 * @name {string} Path.stylus      -- styl source code
 * @name {string} Path.fonts       -- fonts source
 * @name {string} Path.images      -- images source
 */
const PATH = {
  root: '../../',
  cdnDist: 'dist',
  dist: 'dist',
  ui: './',
  stylus: '/stylus/',
  es6: '',
  fonts: '/fonts/',
  images: '/images/',
  docs: '/docs/',
  maps: './maps/'
};

/**
 * path unit to unitPath
 */
let unitPath = unitVersion(ENVPARAMS);




/*****  功能函数定义  *****/

/**
 * unitVersion组合更新版本
 * @param {object} envParams  - 基本参量配置
 * @return {object}  - 组合更新后路径参量
 */
function unitVersion (envParams){
  let unitPath = {
    uiBase: PATH.ui,
    ui: PATH.ui,
    dirVersion: PATH.ui + envParams.version,
    cdnDist: PATH.root + PATH.cdnDist + '/ui',
    dist: PATH.root + PATH.dist,
    distVersion: PATH.root + PATH.cdnDist + '/ui/',
    stylus: PATH.ui + envParams.version + PATH.stylus,
    es6: '',
    fonts: PATH.ui + envParams.version + PATH.fonts,
    images: PATH.ui + envParams.version + PATH.images,
    docs: PATH.ui + envParams.version + PATH.docs
  }
  return unitPath;
};

/**
 * onError 错误处理
 * @name {function} onError
 * @param {string} err        -- 错误信息
 * @param {object} _context   -- 流对象
 *
 */
let onError = (err, _context) => {
  if (ci) {
      // stop in CI
      process.exit(1);
  } else {
      // keep going in non-CI
      console.log(err);
      _context.emit('end');
  }
};

/**
 * streamFile文件流信息打印
 * @param {string} task
 * @return {object}  - 流函数
 */
let streamFile = (task) => {
  return through2.obj((chunk, enc, cb) => {
    console.log(`\n${chunk.relative}\n`);
    cb(null, chunk);
  });
}

/**
 * checkVersion检查启动命名
 * @name {function} checkVersion
 * @param {function} callback   -- 回调控制执行函数promise
 */
let checkVersion = (callback) => {
  const reg = REGS.regVer;
  const regDir = REGS.regDir;
  const regVersion = REGS.regVersion;
  let dirInfos;
  let args = process.argv.slice(2);
  let startEnv;
  let tasks = [];

  // 启动环境控制分派任务
  if(args.length > 0){
    startEnv = args[0];
  }
  switch(startEnv){
    case 'start':
      tasks = tasks.concat(['watch']);
      ENVPARAMS.env = ENVPARAMS.Env.dev;
      break;
    case 'build':
    ENVPARAMS.env = ENVPARAMS.Env.pro;
      break;
  }
  if(tasks.length > 0){
    ENVPARAMS.tasks = ENVPARAMS.tasks.concat(tasks);
  }

  // 构建提示信息
  dirVersions(function(dirInfos){
    let command;
    let commandOb = {};
    dirInfos = INFOS.dirVersionInfos(dirInfos);
    console.log(`${dirInfos}\n`);
    // -v or -c
    console.log(args)  // -> 测试
    // command = args.slice(1);
    // command.forEach((c, index)=>{
    //   if(commandOb){

    //   }
    // })
    if(args[1] && reg.test(args[1]) && regVersion.test(args[2])){
      ENVPARAMS.version = args[2];
      // // 更新版本控制
      unitPath = unitVersion(ENVPARAMS);
    }
    console.log(`生成配置: \n${JSON.stringify(ENVPARAMS, null, '\t')}\n`, `\n启动环境: ${ENVPARAMS.env}`, `\n构建版本: ${ENVPARAMS.version}\n`);
    callback();
  });
};

/**
 * dirVersions目录检测列表命名
 * @name {function} dirVersions
 * @param {function} callback  -- 回调控制流程函数
 */
let dirVersions = (callback) => {
  const regVersion = REGS.regVersion;
  fs.readdir(PATH.ui, (err, files) => {
    if(err){
      console.log('version dir is error');
      return false;
    }

    // no files dir
    if(!files || files.length === 0){
      console.log('version dir is error');
      return false;
    }

    // filter dir vertion
    files = files.filter((name, index) => {
      return regVersion.test(name);
    });
    callback(files);
  })
};

/**
 * autoPreFixer自动设置添加CSS3属性前缀
 * @name {function} autoPreFixer
 * @param {function} callback  -- 回调控制流程函数
 *
 * sourcemap 添加映射
 */
let autoPreFixer = (callback) => {
  return postcss([ autoprefixer()]);
}
let sourcemap = () => {
}

/**
 * fontmins字体压缩控制
 */
let fontmins = () => {
  return fontmin({
    text: '天地玄黄 宇宙洪荒',
  })
}

/**
 * imagemins图片压缩控制
 */
let imagemins = () => {
  return imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
        {removeViewBox: true},
        {cleanupIDs: false}
      ]
    })
  ],{
    verbose: true
  })
}




/**********  任务定义  **********/

/**
 * 开启构建流程
 * @description main process start
 */
gulp.task('startConstruct', (cb) => {
  const deferred = Q.defer();
  checkVersion(function(){
    deferred.resolve();
  });
  return deferred.promise;
})

/**
 * construct version directory
 * @description rely task
 */
gulp.task('version', ['clean:dist'], (cb) => {
  if(ENVPARAMS.tasks && ENVPARAMS.tasks.length > 0){
    runSequence('stylus', 'images', 'fonts', 'docs', ENVPARAMS.tasks, cb);
  }else{
    runSequence('stylus', 'images', 'fonts', 'docs',cb);
  }
})

/**
 * clean dist dir
 * 单文件删除(默认,已经集成到环境任务中)
 * 多文件删除(已提供单独命令启动，查看package.json)
 */
gulp.task('clean:dist', (cb) => {
  let argv = process.argv.slice(2);
  let version = ENVPARAMS.version;
  let distPath = unitPath.distVersion + version;
  if(argv && argv.length>0){
    let isAll = process.env.npm_lifecycle_event === 'clean:all' ? true : false;
    if(isAll){
      distPath = unitPath.cdnDist;
    }
  }
  return del([distPath], {force: true}).then(paths => {
    console.log(`\nDeleted folders ${ENVPARAMS.version} start...\n`);
    console.log(paths.join('\n'));
    console.log(`\nDeleted folders ${ENVPARAMS.version} start...\n`);
  });
})

/**
 * watch stylus to complied
 */
gulp.task('watch', (cb) => {
  gulp.watch(unitPath.stylus + '/**/*' + FILEEXT.stylus, ['stylus']);
  gulp.watch(unitPath.fonts + '/**/*' + FILEEXT.fonts, ['fonts']);
  gulp.watch(unitPath.images + '/**/*' + FILEEXT.images, ['images']);
})

/**
 * compiled stylus to css
 * base - ./ui
 */
gulp.task('stylus', () => {
  let s;
  return s = gulp.src(unitPath.stylus + 'ui' + FILEEXT.stylus, {base: unitPath.ui})
    .pipe(ifElse(ENVPARAMS.env === ENVPARAMS.Env.dev, () => {
      return plumber({
        errorHandler: (error) => {
          onError(error, s);
        }
      })
    }))
    .pipe(ifElse(ENVPARAMS.env === ENVPARAMS.Env.dev, () => {
      return sourcemaps.init({
        loadMaps: true,
        largeFile: true
      })
    }))
    .pipe(stylus())
    .pipe(ifElse(ENVPARAMS.env === ENVPARAMS.Env.dev, () => {
      return sourcemaps.identityMap();
    }))
    .pipe(autoPreFixer())
    .pipe(ifElse(ENVPARAMS.env === ENVPARAMS.Env.dev, () => {
      return csslint.formatter();
    }))
    .pipe(ifElse(ENVPARAMS.env === ENVPARAMS.Env.dev, () => {
      return csslint({
        'shorthand': false
      });
    }))
    .pipe(ifElse(ENVPARAMS.env === ENVPARAMS.Env.pro,() => {
      return cssmin();
    }))
    .pipe(ifElse(ENVPARAMS.env === ENVPARAMS.Env.pro, () => {
      return rename({suffix: '.min'})
    }))
    .pipe(ifElse(ENVPARAMS.env === ENVPARAMS.Env.dev, () => {
      return sourcemaps.write('./'+ENVPARAMS.version+'/maps',{
        sourceRoot:function(file){
          //console.log('../'+file.relative+'/maps');
          return  '../'+ENVPARAMS.version
        },
        //destPath: './'+ENVPARAMS.version + '/maps',  //这里有问题map地址问题
        charset: 'utf8'
      });
    }))
    .pipe(gulp.dest(unitPath.cdnDist));
})

/**
 * handle fonts
 * base - ./ui
 */
gulp.task('fonts', () => {
  return gulp.src(unitPath.fonts + '/**/*' + FILEEXT.fonts, {base: unitPath.ui})
    .pipe(ifElse(ENVPARAMS.env === ENVPARAMS.Env.dev, () => {
      return streamFile('fonts')
    }))
    .pipe(ifElse(ENVPARAMS.env === ENVPARAMS.Env.pro, fontmins))
    .pipe(gulp.dest(unitPath.cdnDist))
})

/**
 * handle images
 * base - ./ui
 */
gulp.task('images', () => {
  return gulp.src(unitPath.images + '/**/*' + FILEEXT.images, {base: unitPath.ui})
    .pipe(ifElse(ENVPARAMS.env === ENVPARAMS.Env.dev, () => {
      return streamFile('images');
    }))
    .pipe(ifElse(ENVPARAMS.env === ENVPARAMS.Env.pro, imagemins))
    .pipe(gulp.dest(unitPath.cdnDist))
})

/**
 * handle docs
 * document file
 * base - ./ui
 */
gulp.task('docs', () => {
  return gulp.src(unitPath.docs + '/**/*', {base: unitPath.ui})
    .pipe(gulp.dest(unitPath.cdnDist))
})


/*
  定义监测es错误检查
*/
// gulp.task('lint', () => {
//   let task;
//   task = gulp.src(filePath.js + '/scripts/**/*.js')
//     .pipe(eslint())
//     .pipe(eslint.format())
//     .pipe(eslint.failOnError())
//     .on("error", (err) => {
//       onError(err, task);
//     });
//   return task;
// })

// /*
//   任务定义 es6 css
// */
// gulp.task('es6', () => {
//   return gulp.src([filePath.js + '/scripts/**/*.js', filePath.js + '/utils/**/*.js'], { base: filePath.baseUrl })
//     .pipe(through2.obj((chunk, enc, callback) => {
//       console.log(chunk.relative);
//       callback(null, chunk);
//     }))
//     .pipe(babel())
//     .pipe(gulp.dest(filePath.distUrl));
// })

// var v = 0,m=0,s = 0,l;['1.0.0','2.0.2','1.0.1'].forEach(function(a,v){
//   var reg = /^(\d+)((\.\d+)*)$/;
//   var k = a.match(reg);//console.log(k);
//   var a0 = Number(k[1],10);
//   var a1 = k[2];
//   var a1v;
//   var a3

//   if(a0 > v){
//   v = a0;
//   }
//   if(a1.indexOf('.')>-1){ //1.0 1.1
//      a1 = a1.split('\.');
//   }
//   if(a1.length > 0){
//     a1v = Number(a1[1],10);
//     a3 = Number(a1[2],10);
//   }
//   console.log(a0,a1v,a3);
//   if(a0 > v){
//     v = a0;m = a1v; s = a3;
//   }else{
//     v = a0
//     if(a1v > m){
//     v = a0;m = a1v;
//     }
//   }
// });






/**
 * start
 * task - start/build
 * envParams.tasks  - env set
 */
gulp.task('start', ['startConstruct'], (cb) => {
  console.log('[构建start...] 👷 👷');
  // control process
  runSequence('version', cb);
})
gulp.task('build', ['startConstruct'], (cb) => {
  console.log('[构建build...] 👷 👷');
  // control process
  runSequence('version', cb);
})