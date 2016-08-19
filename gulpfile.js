var gulp = require("gulp");

// Files to copy
var files = [
    "src/*.css",
    "src/*.js",
    "node_modules/bootstrap/dist/css/bootstrap.min.css",
    "node_modules/bootstrap/dist/js/bootstrap.min.js",
    "node_modules/jquery/dist/jquery.min.js"
];

// Task
gulp.task("default", function() {
    // Parse the files to copy
    files.forEach(function(path) {
        console.log(path);
        gulp.src(path)
        .pipe(gulp.dest("app"));
    });
});