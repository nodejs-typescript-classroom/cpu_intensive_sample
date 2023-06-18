# cpu intensive sample

This is demo for cpu intensive sample with blocking all service sample and how to solved it by work_thread

## What is Non-Blocking I/O?

When I/O request in, system could use handle request concurrently without blocking each I/O request

## For each Nodejs Runtime

Because Nodejs Runtime is Single Thread Process

I/O Intensive Job could handle I/O concurrently with libuv Library with Event Loop 

CPU Intensive Job will blocking other jobs

![](https://hackmd-prod-images.s3-ap-northeast-1.amazonaws.com/uploads/upload_cb06d4da8b33e690b2476b89040e7eab.png?AWSAccessKeyId=AKIA3XSAAW6AWSKNINWO&Expires=1687092383&Signature=6kGPUyaohZEApHCx6pFP7A7J0AA%3D)
![](https://hackmd-prod-images.s3-ap-northeast-1.amazonaws.com/uploads/upload_6f37392e0e79b2038f1576505fb80190.png?AWSAccessKeyId=AKIA3XSAAW6AWSKNINWO&Expires=1687092415&Signature=ANW%2FqPEQC44wV2rHR4sG2DWLIaM%3D)
![](https://hackmd-prod-images.s3-ap-northeast-1.amazonaws.com/uploads/upload_a8eaa3a76244c50eb1bd91c5de61fc88.png?AWSAccessKeyId=AKIA3XSAAW6AWSKNINWO&Expires=1687092436&Signature=8fCLMuLEU1Y%2Bn912A7cNQpzDZPs%3D)

## When we handle cpu intensive job on service

This will block other incoming request

```typescript
export const heavilyJob = (totalCount = 20_000_000_000): number => {
  let count = 0;
  console.log({ totalCount });
  for (let i = 0; i < totalCount; i++) {
    count++;
  }
  return count;
};

```

## to avoid cpu intensive job blocking

work thread is the solution for this situation

instead of invocating heavily job directly

we could worker thread to handle heavily job
```javascript
import { parentPort } from 'worker_threads';
import { heavilyJob } from './heavily-job';

parentPort.postMessage(heavilyJob(HEAVY_COUNT));
```
```typescript
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
return {
  count,
  message: 'this is block service',
};
```

with this kind of invocating the function

our application would be free to blocking other service

## more advance improvement

make use of max cpu core of power

### check total core of cpu in linux
```shell
nproc
```

### we could seperate our worker thrread to run parallel

```javascript
import { parentPort, workerData } from 'worker_threads';
import { heavilyJob } from './heavily-job';
import { HEAVY_COUNT } from './constant';

parentPort.postMessage(heavilyJob(HEAVY_COUNT / workerData.thread_count));
```
```typescript
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
```
```typescript
const workerPromises: Promise<number>[] = [];
for (let i = 0; i < THREAD_COUNT; i++) {
  workerPromises.push(this.fourWorkerService.createWorker());
}
const thread_results = await Promise.all(workerPromises);
const total =
  thread_results[0] +
  thread_results[1] +
  thread_results[2] +
  thread_results[3];
return {
  data: total,
  message: 'this is block service',
};
```

## test with benchmark

single worker

![](https://i.imgur.com/YOmAwYW.png)

four worker

![](https://i.imgur.com/i2sclXT.png)

20 seconds vs 5 seconds

almost 4 time faster