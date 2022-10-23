const useImageMagick = true;

import gulp from "gulp";
import rename from "gulp-rename";
import changed from "gulp-changed";
import imageresize from "gulp-image-resize";
import imagemin from "gulp-imagemin";
import imageminMozJpeg from "imagemin-mozjpeg";
import imageminWebp from "imagemin-webp";

/**
 *
 * @param {*} configuration
 * @returns
 */

const resizeImageJpg = (configuration) => {
  return new Promise((resolve, reject) => {
    try {
      configuration.versions.forEach(function (version) {
        gulp
          .src(configuration.source + "/**/*." + configuration.sourceExt)
          .pipe(
            changed(configuration.dest, { extension: version.suffix + ".jpg" })
          )
          .pipe(
            imageresize({
              percentage: version.percent,
              quality: 1,
              imageMagick: useImageMagick,
              format: "jpeg",
            })
          )
          .pipe(
            imagemin(
              [imageminMozJpeg({ quality: version.quality.jpg * 100 })],
              { verbose: true }
            )
          )
          .pipe(
            rename(function (path) {
              path.extname = version.suffix + ".jpg";
            })
          )
          .pipe(gulp.dest(configuration.dest));
      });
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 *
 * @param {*} configuration
 * @returns
 */

const resizeImageWebp = (configuration) => {
  return new Promise((resolve, reject) => {
    try {
      configuration.versions.forEach(function (version) {
        gulp
          .src(configuration.source + "/**/*." + configuration.sourceExt)
          .pipe(
            changed(configuration.dest, { extension: version.suffix + ".webp" })
          )
          .pipe(
            imageresize({
              percentage: version.percent,
              quality: 1,
              imageMagick: useImageMagick,
            })
          )
          .pipe(
            imagemin([imageminWebp({ quality: version.quality.webp * 100 })], {
              verbose: true,
            })
          )
          .pipe(
            rename(function (path) {
              path.extname = version.suffix + ".webp";
            })
          )
          .pipe(gulp.dest(configuration.dest));
      });
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

export { resizeImageJpg, resizeImageWebp };
