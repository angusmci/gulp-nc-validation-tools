# README

## Overview

This is a simple library for use with [`gulp`](https://gulpjs.org/) that provides some utility functions for generating images at multiple resolutions and in different formats, based on high-resolution source images.

For example, if you have a source PNG, these functions can be used to create JPEG and WebP images in various resolutions for use on the pages of a website.

This is NOT a finished library. It's a set of thrown-together functions for use in my own projects. If it's useful to you, that's great, but it's not a finished or polished product, and it's subject to alteration or even removal without notice.

## Usage

The functions expect a `configuration` object which describes how to transform the images. The configuration should look something like:

    const myConfiguration = {
        name: "resize-banners",
        source: "./graphics/banners/",
        dest: "./static/images/banners/",
        sourceExt: "png",
        versions: [
            { percent: 100, 
              suffix: "@1x", 
              quality: { jpg: 0.6, webp: 0.6 } },
            { percent: 50,
              suffix: "@0.5x", 
              quality: { jpg: 0.6, webp: 0.6 } },
            { percent: 25,
              suffix: "@0.25x", 
              quality: { jpg: 0.6, webp: 0.6 } },
        ],
    };

This configuration will find all the PNG files (`sourceExt` = `png`) in the `graphics/banners` directory (`source` = `graphics/banners`) and created transformed files in the `static/images/banners` directory (`dest` = `static/images/banners`). The `versions` attribute describes how many versions of each image to make. In this example, for each input image and for each image format, it will produce three different versions: a full-size version (`100`), which gets a suffix of `@1x`, a half-size version (`50`) with a suffix of `@0.5x`, and a quarter-size version (`25`), which is suffixed with `@0.25x`. The `quality` value controls the compression quality setting used for each size and format.

You can specify as many different sizes as you like, and use whatever quality settings work for you.

The functions can then be invoked with calls such as:

    resizeImageJpg(myConfiguration)

For example, a `gulp` task definition might look like:

    import { resizeImageJpg, resizeImageWebp } from 'gulp-nc-image-utilities';

    gulp.task(
        "resize",
        gulp.parallel(
            () => resizeImageJpg(myConfiguration),
            () => resizeImageWebp(myConfiguration)
        )
    );

