import { IncomingMessage } from 'http';
import Busboy from 'busboy';
import { FormDataField } from '../entities/form-data';
import { Stream } from 'stream';

export interface FileStreamWrapper {
  stream: Stream;
  fileName: string;
  contentType: string;
}

export type StreamProcessFunction = (stream: Stream) => Promise<any>;

export class FormDataParser {
  private busboy: Busboy;
  private files: FileStreamWrapper[];
  private finished: boolean = false;
  private finishedFields: boolean = false;
  private invalidFormData: boolean = false;
  private processedFiles: FileStreamWrapper[];

  constructor(req: IncomingMessage) {
    this.busboy = new Busboy({ headers: req.headers });
  }

  getFields(): Promise<FormDataField[]> {
    const fields: FormDataField[] = [];
    let isFirstFile: boolean = true;

    return new Promise((resolve, reject) => {
      this.busboy.on('field', (fieldName: string, value: string) => {
        const formDataField: FormDataField = { value, fieldName };
        fields.push(formDataField);

        console.log(`busboy has found a field: ${fieldName}: ${value}`);
      });

      this.busboy.on('file', (...args) => {
        if (!fields.length && !this.finishedFields) {
          this.finishedFields = true;
          this.invalidFormData = true;
          return reject(new Error('Fields not sent or appended after files'));
        }

        const stream: Stream = args[1];
        const fileName: string = args[2];
        const contentType: string = args[4];

        console.log(`busboy has found a file: ${fileName}`);

        if (isFirstFile) {
          resolve(fields);
          isFirstFile = false;
        }

        this.files.push({
          stream,
          fileName,
          contentType
        });
      });

      this.busboy.on('finish', () => {
        if (!fields.length && !this.finishedFields) {
          this.finishedFields = true;
          this.invalidFormData = true;

          return reject(new Error('Fields not sent or appended after files'));
        }

        this.finished = true;
      });

      this.busboy.on('error', error => reject(error));
    });
  }

  async processFiles(doProcessing: StreamProcessFunction): Promise<any> {
    const processStream = async (file: FileStreamWrapper) => {
      const processingResult = await doProcessing(file.stream);

      this.processedFiles.push(file);
      return processingResult;
    };

    if (this.finished) {
      // all files are already inside `this.files`
      // which is unlikely
      return Promise.all(this.files.map(file => processStream(file)));
    }
  }

  getProcessedFiles(): FileStreamWrapper[] {
    return this.processedFiles;
  }
}
