import { FormDataFields } from '../../../entities/form-data';
import Ajv, { ErrorObject } from 'ajv';

export function validateFormDataFields(
  schema: any,
  fields: FormDataFields
): ErrorObject[] | void {
  const ajv = new Ajv();

  ajv.validate(schema, fields);

  return ajv.errors;
}
