export class NoFilesError extends Error {}

export class FormDataInvalidFormError extends Error {
  constructor() {
    super('Invalid form data');
  }
}

export class FormDataNoFieldsError extends Error {
  constructor() {
    super('You have not filled the form properly');
  }
}

export class FormDataNoFilesError extends Error {
  constructor() {
    super('You have not provided any files');
  }
}
export class FormDataNoFieldsBeforeFilesError extends Error {
  constructor() {
    super(
      'The provided form has no fields or they are appended after the files'
    );
  }
}

export class FormDataInvalidFileError extends Error {}

export class InsertFailedError extends Error {}
