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
      fancylog.info(`Validating ${jsonFile} against ${schemaFile}`);
      var theJson = await loadJsonFile(jsonFile);
      var theSchema = await loadJsonFile(schemaFile);
      const ajv = new Ajv();
      const validate = ajv.compile(theSchema);
      const valid = validate(theJson);
      if (!valid) {
        fancylog.warn(validate.errors);
        reject(`'${jsonFile} contained errors`);
      }
      resolve(valid);
    } catch (err) {
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
  return new Promise(async (resolve, reject) => {
    try {
      const filenames = await fsPromises.readdir(jsonDir);
      for (const filename of filenames) {
        if (filename.endsWith("json")) {
          const filePath = path.join(jsonDir, filename);
          await validateJson(filePath, schemaFile);
        }
      }
    } catch (err) {
      reject(err);
    }
    resolve(true);
  });
};

/* ======================================================================
 * EXPORTS
 * ====================================================================== */

export { validateJson, validateJsonDirectory };
