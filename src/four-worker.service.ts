import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import * as path from 'path';
import { THREAD_COUNT } from './constant';
@Injectable()
export class FourWorkerCreateService {
  createWorker() {
    return new Promise<number>((resolve, reject) => {
      const worker = new Worker(path.join(__dirname, 'four-worker.js'), {
        workerData: {
          thread_count: THREAD_COUNT,
        },
      });
      worker.on('message', (data: number) => {
        resolve(data);
      });
      worker.on('error', (error) => {
        reject(error);
      });
    });
  }
}
