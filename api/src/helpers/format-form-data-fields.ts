import { FormDataFields } from '../entities/form-data';
import { identity } from 'lodash';

export type CustomFormatRules<T> = { [P in keyof T]?: (val: string) => T[P] };

export function formatFields<T>(
  fields: FormDataFields,
  customRules?: CustomFormatRules<T>
): T {
  const formatted = {};

  Object.keys(fields).forEach(fieldName => {
    const processValue =
      customRules && customRules[fieldName] ? customRules[fieldName] : identity;

    formatted[fieldName] = processValue(fields[fieldName]);
  });

  return formatted as T;
}
