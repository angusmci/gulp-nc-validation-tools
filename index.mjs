import { promises as fsPromises } from "fs";
import Ajv from "ajv";
import fancylog from "fancy-log";

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

/* ======================================================================
 * EXPORTS
 * ====================================================================== */

export { validateJSON };
