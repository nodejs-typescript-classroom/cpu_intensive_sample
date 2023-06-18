import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import * as path from 'path';
import { THREAD_COUNT } from './constant';
import { FourWorkerCreateService } from './four-worker.service';
import { heavilyJob } from './heavily-job';
@Injectable()
export class AppService {
  constructor(private readonly fourWorkerService: FourWorkerCreateService) {}
  async blocking() {
    // const workerPromises: Promise<number>[] = [];
    // for (let i = 0; i < THREAD_COUNT; i++) {
    //   workerPromises.push(this.fourWorkerService.createWorker());
    // }
    // const thread_results = await Promise.all(workerPromises);
    // const total =
    //   thread_results[0] +
    //   thread_results[1] +
    //   thread_results[2] +
    //   thread_results[3];
    // return {
    //   data: total,
    //   message: 'this is block service',
    // };
    const workerPromise: Promise<number> = new Promise<number>(
      (resolve, reject) => {
        const worker = new Worker(path.join(__dirname, './worker.js'));
        worker.on('message', (data: number) => {
          resolve(data);
        });
        worker.on('error', (error) => {
          reject(error);
        });
      },
    );
    const count = await workerPromise;
    // const count = heavilyJob();
    return {
      count,
      message: 'this is block service',
    };
  }
  nonBlocking(): string {
    return 'This is non-block service';
  }
}
