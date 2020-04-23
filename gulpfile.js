const gulp = require('gulp');
// Live Server
const browserSync = require('browser-sync').create();

// Import các Plugins cần dùng
const sass = require('gulp-sass'), // Compiler
    cssnano = require('cssnano'), // thu nhỏ file css
    autoprefixer = require('autoprefixer'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyJs = require('gulp-terser'),
    rename = require('gulp-rename'), // đổi tên như mình muốn
    del = require('del'); // xóa dist cũ đi 

// Tạo paths cho dễ chỉnh sửa
const paths = {
    scripts: {
        src: 'src/js/*.js',
        dest: 'src/assets/js/'
    },
    styles: {
        src: 'src/scss/*.scss',
        dest: 'src/assets/css/'
    }
};

// Funktion xóa file
const clean = () => del(['src/assets']);

// Xử lý Scripts
const scripts = () => {
    return gulp.src(paths.scripts.src)
        .pipe(minifyJs())
        .pipe(rename(function(path) {
            path.basename += ".min";
        }))
        .pipe(gulp.dest(paths.scripts.dest));
};

//Xử lý Styles
const styles = () => {
    // tìm u. lấy file.scss để compile
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init()) // Tạo sourcmaps
        // gọi gulp-sass ra để thực thi vs file
        .pipe(sass().on('error', sass.logError))
        // tự động đưa Prefix vào và thu nhỏ file css
        // .pipe(postcss([autoprefixer(), cssnano()]))
        // ko thu nho mac du file= min.css
        .pipe(postcss([autoprefixer()]))

        // đổi tên cho css
        .pipe(rename({
            suffix: '.min'
        }))
        // ghi filemap ra 
        .pipe(sourcemaps.write('.'))
        // trả về file đã sử lý
        .pipe(gulp.dest(paths.styles.dest));
};


// Start browserSync Server
/* Để lại để biết các gọi Task từ task khác */
gulp.task('browserSync', function(done) {
    browserSync.init({
        server: "./src"
    });
    done();
});

function reload(done) {
    browserSync.reload();
    done();
}
gulp.task('clean', clean);

// CMD chạy: gulp = phải cài global gulp
gulp.task('default', gulp.series(clean,
    gulp.parallel(styles, scripts), 'browserSync',
    function() {
        gulp.watch(paths.styles.src, gulp.series(styles, reload));
        gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
        gulp.watch('src/*.html').on('change', browserSync.reload);
    }
));