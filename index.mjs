import { promises as fsPromises } from "fs";
import Ajv from "ajv";
import fancylog from "fancy-log";
import path from "path";

const loadJsonFile = async (filePath) => {
  const theJson = await fsPromises.readFile(filePath, "utf8");
  return JSON.parse(theJson);
};

/**
 * Validate a JSON file against a JSON schema (https://json-schema.org/)
 *
 * @param {*} jsonFile
 * @param {*} schemaFile
 * @returns
 */
const validateJson = async (jsonFile, schemaFile) => {
  return new Promise(async (resolve, reject) => {
    try {
      var theJson = await loadJsonFile(jsonFile);
      var theSchema = await loadJsonFile(schemaFile);
      const ajv = new Ajv();
      const validate = ajv.compile(theSchema);
      const valid = validate(theJson);
      if (!valid) {
        let theError = validate.errors[0];
        let thePath = theError.instancePath || '/';
        let theDetails = Object.keys(theError.params).map((key) => `${key}=${theError.params[key]}`).join(",");
        reject(`'${jsonFile}': ${thePath} ${theError.message} (${theDetails})`);
      }
      resolve(valid);
    } catch (err) {
      fancylog.error(`Failed to read ${jsonFile}: ${err.message}`);
      reject(err);
    }
  });
};

/**
 * Validate a complete directory of JSON documents against a specified schema.
 *
 * @param {*} jsonDir
 * @param {*} schemaFile
 * @returns
 */
const validateJsonDirectory = async (jsonDir, schemaFile) => {
  let errorCount = 0;
  fancylog.info(`Validating ${jsonDir} against ${schemaFile}`);
  return new Promise(async (resolve, reject) => {
    try {
      const filenames = await fsPromises.readdir(jsonDir);
      for (const filename of filenames) {
        if (filename.endsWith("json")) {
          const filePath = path.join(jsonDir, filename);
          await validateJson(filePath, schemaFile).catch((err) =>
          {
      		errorCount++;
      		fancylog.error(err);
          });
        }
      }
    } catch (err) {
  		fancylog.info(`Errors detected while validating ${jsonDir} against ${schemaFile}`);
    }
    if (errorCount > 0) {
    	reject(`${errorCount} error(s) detected`);
    }
    resolve(true);
  });
};

/* ======================================================================
 * EXPORTS
 * ====================================================================== */

export { validateJson, validateJsonDirectory };
