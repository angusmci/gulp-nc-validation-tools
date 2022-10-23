const useImageMagick = true;

import gulp from "gulp";
import rename from "gulp-rename";
import changed from "gulp-changed";
import imageresize from "gulp-image-resize";
import imagemin from "gulp-imagemin";
import imageminMozJpeg from "imagemin-mozjpeg";
import imageminWebp from "imagemin-webp";
import sharp from "sharp";
import through2 from "through2";

/**
 * Convert files to JPEG according to the specifications given in a configuration.
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
 * Convert files to WebP according to the specifications given in a configuration.
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

/**
 * Use `sharp` to get the metadata for an image.
 *
 * @param {*} input
 * @returns
 */
const getImageMetadata = async (input) => {
  return await sharp(input).metadata();
};

/**
 * Convert files to AVIF according to the specifications given in a configuration.
 *
 * @param {*} configuration
 * @returns
 */
const resizeImageAvif = (configuration) => {
  return new Promise((resolve, reject) => {
    try {
      configuration.versions.forEach(function (version) {
        gulp
          .src(configuration.source + "/**/*." + configuration.sourceExt)
          .pipe(
            changed(configuration.dest, { extension: version.suffix + ".avif" })
          )
          .pipe(
            through2.obj(async function (file, _, cb) {
              let metadata = await getImageMetadata(file.contents);
              let width = Math.floor((metadata.width * version.percent) / 100);
              let converted = sharp(file.contents)
                .resize({ width: width })
                .avif({ quality: Math.floor(version.quality.avif * 100) })
                .toBuffer();
              return converted
                .then(function (buffer) {
                  file.contents = buffer;
                  return cb(null, file);
                })
                .catch(function (err) {
                  console.error(err);
                  return cb(null, file);
                });
            })
          )
          .pipe(
            rename(function (path) {
              path.extname = version.suffix + ".avif";
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

/* ======================================================================
 * EXPORTS
 * ====================================================================== */

export { resizeImageJpg, resizeImageWebp, resizeImageAvif };
