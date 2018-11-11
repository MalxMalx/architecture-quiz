import Busboy from 'busboy';
import { IncomingMessage } from 'http';
import { FormDataField } from '../entities/form-data';
import {
  FormDataInvalidFormError,
  FormDataNoFieldsError,
  FormDataNoFilesError,
  FormDataNoFieldsBeforeFilesError
} from './errors';
import { Stream } from 'stream';

export interface FileStreamWrapper {
  stream: Stream;
  fileName: string;
  contentType: string;
}

export type FileProcessFunction = (file: FileStreamWrapper) => Promise<any>;

export class FormDataParser {
  private busboy;
  private error: Error;
  private fields: FormDataField[] = [];
  private processedFiles: FileStreamWrapper[] = [];
  private formHasFields: Boolean = false;
  private formHasFiles: Boolean = false;

  constructor(req: IncomingMessage) {
    this.busboy = new Busboy({ headers: req.headers });
    this.init();
  }

  private init() {
    this.busboy.on('finish', () => {
      if (!this.formHasFiles && !this.formHasFields) {
        this.error = new FormDataInvalidFormError();
      } else if (!this.formHasFields) {
        this.error = new FormDataNoFieldsError();
      } else if (!this.formHasFiles) {
        this.error = new FormDataNoFilesError();
      }
    });
    this.busboy.on('error', error => {
      this.error = error;
    });
  }

  public getFields(): Promise<FormDataField[]> {
    return new Promise((resolve, reject) => {
      if (this.error) {
        return reject(this.error);
      }

      this.busboy.on('field', (fieldName, value) => {
        this.formHasFields = true;
        this.fields.push({ fieldName, value });
      });
      this.busboy.on('file', () =>
        this.formHasFields
          ? resolve(this.fields)
          : reject(new FormDataNoFieldsBeforeFilesError())
      );
      // in case there are no files, we don't want the promise to get stuck:
      this.busboy.on('finish', () =>
        this.formHasFields
          ? resolve(this.fields)
          : reject(new FormDataNoFieldsError())
      );
    });
  }

  public processFiles(doProcessing: FileProcessFunction) {
    return new Promise(async (resolve, reject) => {
      if (this.error) {
        return reject(this.error);
      }

      const processingResults: any[] = [];

      this.busboy.on(
        'file',
        async (_fieldName, stream, fileName, _encoding, contentType) => {
          this.formHasFiles = true;

          if (this.error) {
            return reject(this.error);
          }

          const fileData: FileStreamWrapper = {
            stream,
            fileName,
            contentType
          };

          try {
            const result = await doProcessing(fileData);

            this.processedFiles.push(fileData);

            processingResults.push(result);
          } catch (error) {
            reject(error);
          }
        }
      );

      this.busboy.on('finish', () =>
        this.formHasFiles
          ? resolve(processingResults)
          : reject(new FormDataNoFilesError())
      );
    });
  }

  public getProcessedFiles(): any[] {
    return this.processedFiles;
  }
}
