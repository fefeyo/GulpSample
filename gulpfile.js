// メインのgulp
var gulp = require("gulp");
/*
ファイルの同期読み込みが可能
例
JSONファイルを読み込んで、オブジェクトにパース
var obj = JSON.parse(fs.readFileSync("./src/json/config.json", { encoding:"utf8" }));
*/
var fs = require("fs");
// scss変換
var sass = require("gulp-sass");
// ベンダープレフィックス自動生成
var autoprefixer = require("gulp-autoprefixer");
// js圧縮 min
var uglify = require("gulp-uglify");
// ブラウザへのリアルタイム反映
var browser = require("browser-sync");
// エラー対策　発生してもタスクを保つ
var plumber = require("gulp-plumber");
// ファイル名変更
var rename = require("gulp-rename");
// テンプレート作成
var ejs = require("gulp-ejs");
var jsonData = "pages/index.json";
var template = "templates/index.ejs";
var json = JSON.parse(fs.readFileSync(jsonData));
var pages = json.pages;

gulp.task("default",　['server'], function() {
    gulp.watch("js/*.js", ["js"]);
    gulp.watch("css/scss/*.scss", ["sass"]);
});

gulp.task("server", function() {
    browser({
        server: {
            baseDir: "."
        }
    });
});

gulp.task("sass", function() {
    gulp.src("css/scss/*.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest("css"))
    .pipe(browser.reload({stream: true}));
});

gulp.task("js", function() {
    gulp.src("js/*.js")
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest("js/min"))
    .pipe(browser.reload({stream: true}));
});

gulp.task("ejs", function() {
    for(var i = 0; i < pages.length; i++) {
        var id = pages[i].id;
        gulp.src(template)
        .pipe(plumber())
        .pipe(ejs({
            jsonData: pages[i]
        }))
        .pipe(rename(id + ".html"))
        .pipe(gulp.dest('.'));
    }
});
