/*
 * @Description: 越哥哥的小代码,看看就行了
 * @Version: 版本更新中...
 * @Autor: YangYi
 * @Date: 2020-06-01 13:41:10
 * @LastEditors: YangYi
 * @LastEditTime: 2020-06-01 15:02:22
 */ 

let gulp = require("gulp");
let htmlmin = require("gulp-htmlmin");
let cssmin = require("gulp-clean-css");
let jsmin = require("gulp-uglify");
let babel = require("gulp-babel");
let sass = require("gulp-sass");


gulp.task("default",async()=>{    
  

    gulp.watch("./newProject/html/*.html",async ()=>{
        gulp.src("./newProject/html/*.html")
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeEmptyAttributes: true,
            minifyJS: true,
            minifyCSS:true
        }))
        .pipe(gulp.dest("D:\\phpstudy_pro\\WWW\\jingdong\\html"))
    })

    gulp.watch("./newProject/index.html",async ()=>{
        gulp.src("./newProject/index.html")
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeEmptyAttributes: true,
            minifyJS: true,
            minifyCSS:true
        }))
        .pipe(gulp.dest("D:\\phpstudy_pro\\WWW\\jingdong"))
    })

    gulp.watch("./newProject/api/**/*",async ()=>{
        gulp.src("./newProject/api/**/*")
        .pipe(gulp.dest("D:\\phpstudy_pro\\WWW\\jingdong\\api"))
    })
    gulp.watch("./newProject/css/*.scss",async ()=>{
        gulp.src("./newProject/css/*.scss")
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest("D:\\phpstudy_pro\\WWW\\jingdong\\css"))
    })

    gulp.watch("./newProject/js/*.js",async ()=>{
        gulp.src("./newProject/js/*.js")
        .pipe(gulp.dest("D:\\phpstudy_pro\\WWW\\jingdong\\js"))
    })
 
    gulp.src("./newProject/imgs/**/*")
    .pipe(gulp.dest("D:\\phpstudy_pro\\WWW\\jingdong\\imgs"))
    gulp.src("./newProject/libs/**/*")
    .pipe(gulp.dest("D:\\phpstudy_pro\\WWW\\jingdong\\libs"))
    
})