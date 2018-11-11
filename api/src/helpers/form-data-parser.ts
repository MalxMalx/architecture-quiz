import Busboy from 'busboy';
import { IncomingMessage } from 'http';
import { FormDataFields } from '../entities/form-data';
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
  index: number;
}

export type FileProcessFunction = (file: FileStreamWrapper) => Promise<any>;

export class FormDataParser {
  private busboy;
  private error: Error;
  private fields = {};
  private processedFiles: FileStreamWrapper[] = [];
  private formHasFields: Boolean = false;
  private formHasFiles: Boolean = false;
  private processingResults: any[] = [];
  private fileCount: number = 0;
  private firstFile: FileStreamWrapper;
  private hasFinishedParsing: Boolean = false;

  constructor(req: IncomingMessage) {
    this.busboy = new Busboy({ headers: req.headers });
    this.init(req);
  }

  private init(req: IncomingMessage) {
    req.pipe(this.busboy);

    this.busboy.on(
      'file',
      (_fieldName, stream, fileName, _encoding, contentType) => {
        if (this.firstFile) {
          return;
        }
        console.log(`file found: ${fileName}`);

        this.formHasFiles = true;

        const fileData: FileStreamWrapper = {
          stream,
          fileName,
          contentType,
          index: this.fileCount
        };

        this.fileCount += 1;

        this.firstFile = fileData;
      }
    );

    this.busboy.on('finish', () => {
      this.hasFinishedParsing = true;
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

  public getFields(): Promise<FormDataFields> {
    return new Promise((resolve, reject) => {
      if (this.error) {
        return reject(this.error);
      }

      this.busboy.on('field', (fieldName, value) => {
        this.formHasFields = true;
        this.fields[fieldName] = value;
      });
      this.busboy.on('file', () =>
        this.formHasFields
          ? resolve(this.fields as FormDataFields)
          : reject(new FormDataNoFieldsBeforeFilesError())
      );
      // in case there are no files:
      this.busboy.on('finish', () =>
        this.formHasFields
          ? resolve(this.fields as FormDataFields)
          : reject(new FormDataNoFieldsError())
      );
      this.busboy.on('error', error => reject(error));
    });
  }

  public processFiles(doProcessing: FileProcessFunction) {
    console.log('start processing files');

    return new Promise(async (resolve, reject) => {
      if (this.error) {
        return reject(this.error);
      }

      if (this.firstFile) {
        try {
          const result = await doProcessing(this.firstFile);

          this.processedFiles.push(this.firstFile);
          this.processingResults.push(result);
        } catch (error) {
          reject(error);
        }
      }

      if (this.hasFinishedParsing) {
        return resolve(this.processingResults);
      }

      this.busboy.on(
        'file',
        async (_fieldName, stream, fileName, _encoding, contentType) => {
          console.log(`file found: ${fileName}`);

          this.formHasFiles = true;

          if (this.error) {
            return reject(this.error);
          }

          try {
            const fileData: FileStreamWrapper = {
              stream,
              fileName,
              contentType,
              index: this.fileCount
            };

            this.fileCount += 1;

            const result = await doProcessing(fileData);

            this.processedFiles.push(fileData);
            this.processingResults.push(result);
          } catch (error) {
            reject(error);
          }
        }
      );

      this.busboy.on('finish', () =>
        this.formHasFiles
          ? resolve(this.processingResults)
          : reject(new FormDataNoFilesError())
      );
      this.busboy.on('error', error => reject(error));
    });
  }

  public getProcessedFiles(): FileStreamWrapper[] {
    return this.processedFiles;
  }

  public getProcessingResults(): any[] {
    return this.processingResults;
  }
}
