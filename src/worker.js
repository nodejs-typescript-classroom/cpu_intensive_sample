import { parentPort } from 'worker_threads';
import { heavilyJob } from './heavily-job';
import { HEAVY_COUNT } from './constant';

parentPort.postMessage(heavilyJob(HEAVY_COUNT));
