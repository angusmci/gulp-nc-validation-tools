# README

## Overview

This is a simple library for use with [`gulp`](https://gulpjs.org/) that provides some utility functions for validating JSON and other data files.

This is NOT a finished library. It's a set of thrown-together functions for use in my own projects. If it's useful to you, that's great, but it's not a finished or polished product, and it's subject to alteration or even removal without notice.

## Usage

The only function available currently is `validateJson`, which uses `ajv` to validate a JSON file against a JSON schema. See [JSON Schema](https://json-schema.org/) for more information about JSON schemas.

A sample `gulp` task using this might look like:

    gulp.task(
    "test",
    gulp.series(
        () => validateJson("data/a.json", "test/schemas/a.schema.json"),
        () => validateJson("data/b.json", "test/schemas/b.schema.json")
    )
    );

If a file fails validation, an error message will be printed on the console, and the task will fail.